package com.ra.castermovie.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "region")
public class Region {
    @Id
    Integer id;
    @NotNull(message = "Region::name must not be null")
    String name;
    Integer parent;
}
