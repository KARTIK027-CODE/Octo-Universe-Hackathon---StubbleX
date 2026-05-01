"""
Industrial reuse suggestions and market information for agricultural waste types.
"""

from typing import Dict, List

class ReuseSuggestions:
    """Database of industrial reuse options for different waste types."""
    
    WASTE_DATABASE = {
        "rice_straw": {
            "display_name": "Rice Straw",
            "industrial_uses": [
                {
                    "industry": "Paper & Pulp Manufacturing",
                    "application": "Raw material for paper production",
                    "processing": "Requires pulping and chemical treatment",
                    "market_demand": "High"
                },
                {
                    "industry": "Biofuel Production",
                    "application": "Bioethanol and pellet fuel production",
                    "processing": "Requires drying and pelletization",
                    "market_demand": "Medium"
                },
                {
                    "industry": "Mushroom Cultivation",
                    "application": "Growing medium for oyster and button mushrooms",
                    "processing": "Requires sterilization and composting",
                    "market_demand": "High"
                },
                {
                    "industry": "Animal Bedding",
                    "application": "Livestock and poultry bedding",
                    "processing": "Minimal - baling and storage",
                    "market_demand": "Medium"
                }
            ],
            "environmental_benefits": {
                "co2_reduction_per_ton": 1500,  # kg CO2 saved vs burning
                "soil_nitrogen_retained_kg": 4.5,
                "water_savings_liters": 2000
            },
            "price_range": {
                "min_per_ton": 1800,
                "max_per_ton": 2800,
                "currency": "INR"
            }
        },
        
        "wheat_stubble": {
            "display_name": "Wheat Stubble",
            "industrial_uses": [
                {
                    "industry": "Animal Feed Production",
                    "application": "Cattle and sheep fodder (high protein content)",
                    "processing": "Chopping and baling",
                    "market_demand": "Very High"
                },
                {
                    "industry": "Biogas Generation",
                    "application": "Anaerobic digestion for biogas",
                    "processing": "Requires shredding and moisture control",
                    "market_demand": "High"
                },
                {
                    "industry": "Composting",
                    "application": "High-quality organic fertilizer production",
                    "processing": "Mixing with green waste and decomposition",
                    "market_demand": "Medium"
                },
                {
                    "industry": "Particle Board Manufacturing",
                    "application": "Raw material for engineered wood products",
                    "processing": "Requires grinding and binding",
                    "market_demand": "Medium"
                }
            ],
            "environmental_benefits": {
                "co2_reduction_per_ton": 1600,
                "soil_nitrogen_retained_kg": 5.2,
                "water_savings_liters": 2200
            },
            "price_range": {
                "min_per_ton": 3500,
                "max_per_ton": 5500,
                "currency": "INR"
            }
        },
        
        "sugarcane_bagasse": {
            "display_name": "Sugarcane Bagasse",
            "industrial_uses": [
                {
                    "industry": "Cogeneration Power Plants",
                    "application": "Fuel for electricity and steam generation",
                    "processing": "Minimal - moisture reduction",
                    "market_demand": "Very High"
                },
                {
                    "industry": "Paper & Packaging",
                    "application": "Eco-friendly paper and biodegradable packaging",
                    "processing": "Pulping and pressing",
                    "market_demand": "High"
                },
                {
                    "industry": "Building Materials",
                    "application": "Bagasse boards, insulation materials",
                    "processing": "Compression and binding with adhesives",
                    "market_demand": "Medium"
                },
                {
                    "industry": "Bioplastics",
                    "application": "Biodegradable plastic alternatives",
                    "processing": "Chemical extraction and polymerization",
                    "market_demand": "Growing"
                }
            ],
            "environmental_benefits": {
                "co2_reduction_per_ton": 1800,
                "soil_nitrogen_retained_kg": 3.8,
                "water_savings_liters": 1500
            },
            "price_range": {
                "min_per_ton": 2500,
                "max_per_ton": 4000,
                "currency": "INR"
            }
        },
        
        "corn_husk": {
            "display_name": "Corn Husk",
            "industrial_uses": [
                {
                    "industry": "Handicrafts & Textiles",
                    "application": "Handmade products, decorative items",
                    "processing": "Drying and weaving",
                    "market_demand": "Medium"
                },
                {
                    "industry": "Animal Feed",
                    "application": "Silage for cattle (when green)",
                    "processing": "Chopping and ensiling",
                    "market_demand": "High"
                },
                {
                    "industry": "Biofuel Production",
                    "application": "Bioethanol and briquettes",
                    "processing": "Drying, grinding, and pelletization",
                    "market_demand": "Medium"
                },
                {
                    "industry": "Mulching Material",
                    "application": "Garden and agricultural mulch",
                    "processing": "Shredding",
                    "market_demand": "Low"
                }
            ],
            "environmental_benefits": {
                "co2_reduction_per_ton": 1400,
                "soil_nitrogen_retained_kg": 4.0,
                "water_savings_liters": 1800
            },
            "price_range": {
                "min_per_ton": 1500,
                "max_per_ton": 2500,
                "currency": "INR"
            }
        },
        
        "other_crop_residue": {
            "display_name": "Other Crop Residue",
            "industrial_uses": [
                {
                    "industry": "Composting",
                    "application": "Organic fertilizer production",
                    "processing": "Mixing and decomposition",
                    "market_demand": "Medium"
                },
                {
                    "industry": "Biomass Energy",
                    "application": "Combustion for heat and power",
                    "processing": "Drying and pelletization",
                    "market_demand": "Medium"
                },
                {
                    "industry": "Mulching",
                    "application": "Soil cover and weed control",
                    "processing": "Minimal - spreading",
                    "market_demand": "Low"
                }
            ],
            "environmental_benefits": {
                "co2_reduction_per_ton": 1200,
                "soil_nitrogen_retained_kg": 3.5,
                "water_savings_liters": 1500
            },
            "price_range": {
                "min_per_ton": 1000,
                "max_per_ton": 2000,
                "currency": "INR"
            }
        }
    }
    
    @staticmethod
    def get_suggestions(waste_type: str) -> Dict:
        """
        Get industrial reuse suggestions for a given waste type.
        
        Args:
            waste_type: One of rice_straw, wheat_stubble, sugarcane_bagasse, 
                       corn_husk, other_crop_residue
        
        Returns:
            Dictionary containing industrial uses, environmental benefits, 
            and price ranges
        """
        return ReuseSuggestions.WASTE_DATABASE.get(
            waste_type.lower(), 
            ReuseSuggestions.WASTE_DATABASE["other_crop_residue"]
        )
    
    @staticmethod
    def get_all_waste_types() -> List[str]:
        """Get list of all supported waste types."""
        return list(ReuseSuggestions.WASTE_DATABASE.keys())
