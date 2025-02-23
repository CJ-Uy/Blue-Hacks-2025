"use client";
import React, { useEffect, useState, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { useGetLocationData } from "@/zustand/store";

const libraries = ["places"];

export default function AddressSearch() {
    {/* This form was partially created using Generative AI */}
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API,
        libraries,
    });

    const [address, setAddress] = useState("");
    const [addressData, setAddressData] = useState({
        streetAddress: "",
        country: "",
        zipCode: "",
        city: "",
        state: "",
        latitude: null,
        longitude: null,
    });
    const [countryCode, setCountryCode] = useState(null);
    const inputRef = useRef(null);

    const { locationCoordinates, locationCountryCode, locationEmergencyNumbers, error, loading, execute } = useGetLocationData();

    useEffect(() => {
        execute();
    }, [execute]);

    useEffect(() => {
        setCountryCode(locationCountryCode);
    }, [locationCountryCode]);

    useEffect(() => {
        if (!isLoaded || loadError || !countryCode || !inputRef.current) return;

        const options = {
            componentRestrictions: { country: countryCode },
            fields: ["address_components", "geometry"],
        };

        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, options);
        
        // Store the listener for cleanup
        const listener = autocomplete.addListener("place_changed", () => handlePlaceChanged(autocomplete));

        return () => {
            // Cleanup listener when component unmounts or country code changes
            google.maps.event.removeListener(listener);
        };
    }, [isLoaded, loadError, countryCode]);

    const handleChange = (event) => {
        setAddress(event.target.value);
    };

    const handlePlaceChanged = (autocomplete) => {
        if (!isLoaded) return;
        
        const place = autocomplete.getPlace();

        if (!place || !place.geometry) {
            setAddressData({
                streetAddress: "",
                country: "",
                zipCode: "",
                city: "",
                state: "",
                latitude: null,
                longitude: null,
            });
            return;
        }

        formData(place);
    };

    const formData = (data) => {
        const addressComponents = data?.address_components;
        if (!addressComponents) return;

        const componentMap = {
            subpremise: "",
            premise: "",
            street_number: "",
            route: "",
            country: "",
            postal_code: "",
            administrative_area_level_2: "",
            administrative_area_level_1: "",
        };

        for (const component of addressComponents) {
            const componentType = component.types[0];
            if (componentType in componentMap) {
                componentMap[componentType] = component.long_name;
            }
        }

        const formattedAddress = [
            componentMap.subpremise,
            componentMap.premise,
            componentMap.street_number,
            componentMap.route
        ].filter(Boolean).join(" ").trim();

        const latitude = data?.geometry?.location?.lat();
        const longitude = data?.geometry?.location?.lng();

        setAddressData({
            streetAddress: formattedAddress,
            country: componentMap.country,
            zipCode: componentMap.postal_code,
            city: componentMap.administrative_area_level_2,
            state: componentMap.administrative_area_level_1,
            latitude,
            longitude,
        });

        // Update the input field with the formatted address
        setAddress(formattedAddress);
    };

    if (loadError) {
        return <div>Error loading Google Maps API</div>;
    }
    
    return (
        isLoaded && (
            <input 
                type="text"
                name="address"
                ref={inputRef}
                value={address}
                onChange={handleChange}
                placeholder="Search Address"
                className="flex w-[30%] sm:w-[50%] p-2 border rounded"
                required
            />
        )
    );
}