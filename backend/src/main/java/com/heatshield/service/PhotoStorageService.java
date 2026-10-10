package com.heatshield.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Set;
import java.util.UUID;

@Service
public class PhotoStorageService {

    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp");
    private final Path uploadDirectory;

    public PhotoStorageService(@Value("${heatshield.upload-dir:uploads}") String uploadDir) {
        this.uploadDirectory = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    public String store(MultipartFile photo) {
        if (photo == null || photo.isEmpty()) return null;
        if (!ALLOWED_TYPES.contains(photo.getContentType())) {
            throw new IllegalArgumentException("Only JPEG, PNG, and WebP images are supported");
        }

        String extension = StringUtils.getFilenameExtension(photo.getOriginalFilename());
        String filename = UUID.randomUUID() + (extension == null ? "" : "." + extension.toLowerCase());
        try {
            Files.createDirectories(uploadDirectory);
            Files.copy(photo.getInputStream(), uploadDirectory.resolve(filename),
                    StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + filename;
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to store report photo", exception);
        }
    }
}
