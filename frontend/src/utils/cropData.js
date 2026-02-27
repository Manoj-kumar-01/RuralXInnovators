export const getCropSuitability = (stateName) => {
    // Basic mapping of Indian states to Favorable and Unfavorable crops.
    // In a real application, this would come from a backend Model (e.g. Random Forest).
    const suitabilityMap = {
        "Andhra Pradesh": {
            favorable: ["Rice", "Tobacco", "Cotton", "Chilli"],
            unfavorable: ["Apple", "Wheat"]
        },
        "Telangana": {
            favorable: ["Cotton", "Rice", "Maize"],
            unfavorable: ["Wheat", "Apple"]
        },
        "Karnataka": {
            favorable: ["Coffee", "Ragi", "Sunflowers"],
            unfavorable: ["Jute", "Mustard"]
        },
        "Maharashtra": {
            favorable: ["Sugarcane", "Cotton", "Soybean"],
            unfavorable: ["Jute", "Tea"]
        },
        "Uttar Pradesh": {
            favorable: ["Wheat", "Sugarcane", "Potato"],
            unfavorable: ["Coconut", "Coffee"]
        },
        "Punjab": {
            favorable: ["Wheat", "Rice", "Cotton"],
            unfavorable: ["Coffee", "Rubber"]
        },
        "Gujarat": {
            favorable: ["Cotton", "Groundnut", "Tobacco"],
            unfavorable: ["Apple", "Tea"]
        },
        "Tamil Nadu": {
            favorable: ["Rice", "Sugarcane", "Bananas"],
            unfavorable: ["Wheat", "Apple"]
        }
    };

    // Default fallback
    const defaultCrops = {
        favorable: ["Rice", "Vegetables"],
        unfavorable: ["Exotic Fruits"]
    };

    // Try to find a match, ignoring case and minor spelling differences
    const stateKey = Object.keys(suitabilityMap).find(key =>
        stateName.toLowerCase().includes(key.toLowerCase())
    );

    return stateKey ? suitabilityMap[stateKey] : defaultCrops;
};

