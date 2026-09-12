package com.pms.app.pms.backend.auth.controllers;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/files")
public class FileController {

    private static final Path STORAGE_DIR = Paths.get(System.getProperty("user.dir"), "uploads", "images");

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select an image file to upload");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        if (file.getSize() > 2L * 1024 * 1024) {
            throw new IllegalArgumentException("Image must be smaller than 2MB");
        }

        try {
            Files.createDirectories(STORAGE_DIR);

            String originalName = file.getOriginalFilename() == null ? "image" : file.getOriginalFilename();
            String safeName = originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
            String fileName = UUID.randomUUID() + "_" + safeName;
            Path target = STORAGE_DIR.resolve(fileName).normalize();

            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            String imageUrl = "http://localhost:8082/api/v1/files/images/" + fileName;
            return ResponseEntity.ok(Map.of("url", imageUrl, "fileName", fileName));
        } catch (IOException e) {
            throw new IllegalStateException("Failed to upload image", e);
        }
    }

    @GetMapping("/images/{fileName:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String fileName) throws IOException {
        Path target = STORAGE_DIR.resolve(fileName).normalize();
        if (!target.startsWith(STORAGE_DIR) || !Files.exists(target)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found");
        }

        Resource resource = new FileSystemResource(target);
        String mediaType = Files.probeContentType(target);
        MediaType contentType = mediaType != null ? MediaType.parseMediaType(mediaType) : MediaType.APPLICATION_OCTET_STREAM;

        return ResponseEntity.ok()
                .contentType(contentType)
                .body(resource);
    }
}
