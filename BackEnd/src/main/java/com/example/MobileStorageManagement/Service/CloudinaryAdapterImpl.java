package com.example.MobileStorageManagement.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.ByteArrayBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.cloudinary.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.MobileStorageManagement.Adapter.CloudinaryAdapter;

@Service
public class CloudinaryAdapterImpl implements CloudinaryAdapter {

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;


    // ======================= UPLOAD IMAGE ========================= //
    @Override
    public String uploadImage(MultipartFile file, String folder) {
        return uploadToCloudinary(file, folder, "image");
    }

    // ======================= UPLOAD VIDEO ========================= //
    @Override
    public String uploadVideo(MultipartFile file, String folder) {
        return uploadToCloudinary(file, folder, "video");
    }


    // =================== UPLOAD COMMON HANDLER ===================== //
    private String uploadToCloudinary(MultipartFile file, String folder, String resourceType) {
        try {
            long timestamp = System.currentTimeMillis() / 1000;

            Map<String, Object> params = new HashMap<>();
            params.put("timestamp", timestamp);
            params.put("folder", folder);

            String signature = generateSignature(params, apiSecret);

            String url = "https://api.cloudinary.com/v1_1/" + cloudName + "/" + resourceType + "/upload";
            HttpPost post = new HttpPost(url);

            MultipartEntityBuilder builder = MultipartEntityBuilder.create();
            builder.addPart("file", new ByteArrayBody(file.getBytes(),
                    ContentType.DEFAULT_BINARY, file.getOriginalFilename()));
            builder.addTextBody("api_key", apiKey);
            builder.addTextBody("timestamp", String.valueOf(timestamp));
            builder.addTextBody("signature", signature);
            builder.addTextBody("folder", folder);

            post.setEntity(builder.build());

            try (CloseableHttpClient client = HttpClients.createDefault();
                 CloseableHttpResponse response = client.execute(post)) {

                String json = EntityUtils.toString(response.getEntity());
                System.out.println("Cloudinary upload response = " + json);

                JSONObject obj = new JSONObject(json);

                if (!obj.has("secure_url")) {
                    throw new RuntimeException("Upload failed: " + json);
                }

                return obj.getString("secure_url");
            }

        } catch (Exception e) {
            throw new RuntimeException("Upload failed: " + e.getMessage(), e);
        }
    }


    // ======================== DELETE FILE ========================== //
    @Override
    public String deleteFile(String publicId, String resourceType) {
        try {
            long timestamp = System.currentTimeMillis() / 1000;

            Map<String, Object> params = new HashMap<>();
            params.put("timestamp", timestamp);
            params.put("public_id", publicId);

            String signature = generateSignature(params, apiSecret);

            String url = "https://api.cloudinary.com/v1_1/" + cloudName + "/" + resourceType + "/destroy";
            HttpPost post = new HttpPost(url);

            MultipartEntityBuilder builder = MultipartEntityBuilder.create();
            builder.addTextBody("public_id", publicId);
            builder.addTextBody("api_key", apiKey);
            builder.addTextBody("timestamp", String.valueOf(timestamp));
            builder.addTextBody("signature", signature);

            post.setEntity(builder.build());

            try (CloseableHttpClient client = HttpClients.createDefault();
                 CloseableHttpResponse response = client.execute(post)) {

                String json = EntityUtils.toString(response.getEntity());
                System.out.println("Cloudinary delete response = " + json);
                return json;
            }

        } catch (Exception e) {
            throw new RuntimeException("Delete failed: " + e.getMessage(), e);
        }
    }


    // ======================= SIGNATURE BUILDER ====================== //
    private String generateSignature(Map<String, Object> params, String apiSecret) {
        String toSign = params.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> e.getKey() + "=" + e.getValue())
                .collect(Collectors.joining("&"));

        return DigestUtils.sha1Hex(toSign + apiSecret);
    }


    // (OPTIONAL) UPLOAD FROM BYTE ARRAY
    @Override
    public String uploadImage(byte[] data, String folder) {
        try {
            long timestamp = System.currentTimeMillis() / 1000;

            Map<String, Object> params = new HashMap<>();
            params.put("timestamp", timestamp);
            params.put("folder", folder);

            String signature = generateSignature(params, apiSecret);

            String url = "https://api.cloudinary.com/v1_1/" + cloudName + "/image/upload";
            HttpPost post = new HttpPost(url);

            MultipartEntityBuilder builder = MultipartEntityBuilder.create();
            builder.addPart("file", new ByteArrayBody(data,
                    ContentType.DEFAULT_BINARY, UUID.randomUUID().toString()));
            builder.addTextBody("api_key", apiKey);
            builder.addTextBody("timestamp", String.valueOf(timestamp));
            builder.addTextBody("signature", signature);
            builder.addTextBody("folder", folder);

            post.setEntity(builder.build());

            try (CloseableHttpClient client = HttpClients.createDefault();
                 CloseableHttpResponse response = client.execute(post)) {

                String json = EntityUtils.toString(response.getEntity());
                System.out.println("Cloudinary upload response = " + json);

                JSONObject obj = new JSONObject(json);
                return obj.getString("secure_url");
            }

        } catch (Exception e) {
            throw new RuntimeException("Upload failed: " + e.getMessage(), e);
        }
    }
}
