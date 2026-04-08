const { SustainabilityCertification, Property } = require('../models');

const calculateScore = (initiatives) => {
  let score = 0;
  const initiatives_list = [
    'solar_panels',
    'rainwater_harvesting',
    'waste_management',
    'energy_efficient',
    'sustainable_materials',
    'local_employment',
    'carbon_neutral',
    'community_programs'
  ];

  initiatives_list.forEach(initiative => {
    if (initiatives[initiative]) {
      score += 12.5;
    }
  });

  return Math.round(score);
};

const getCertificationLevel = (score) => {
  if (score >= 76) return 'platinum';
  if (score >= 51) return 'gold';
  if (score >= 26) return 'silver';
  return 'bronze';
};

exports.getSustainabilityInfo = async (req, res) => {
  try {
    const { property_id } = req.params;

    const property = await Property.findByPk(property_id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    let sustainability = await SustainabilityCertification.findOne({ where: { property_id } });

    // If no certification exists, create a default one
    if (!sustainability) {
      sustainability = await SustainabilityCertification.create({ property_id });
    }

    res.json(sustainability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSustainabilityInfo = async (req, res) => {
  try {
    const { property_id } = req.params;
    const {
      solar_panels,
      rainwater_harvesting,
      waste_management,
      energy_efficient,
      sustainable_materials,
      local_employment,
      carbon_neutral,
      community_programs,
      notes
    } = req.body;

    // Verify property ownership
    const property = await Property.findByPk(property_id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (property.provider_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    let sustainability = await SustainabilityCertification.findOne({ where: { property_id } });

    if (!sustainability) {
      sustainability = await SustainabilityCertification.create({ property_id });
    }

    // Update initiatives
    const initiatives = {
      solar_panels: solar_panels || sustainability.solar_panels,
      rainwater_harvesting: rainwater_harvesting || sustainability.rainwater_harvesting,
      waste_management: waste_management || sustainability.waste_management,
      energy_efficient: energy_efficient || sustainability.energy_efficient,
      sustainable_materials: sustainable_materials || sustainability.sustainable_materials,
      local_employment: local_employment || sustainability.local_employment,
      carbon_neutral: carbon_neutral || sustainability.carbon_neutral,
      community_programs: community_programs || sustainability.community_programs
    };

    // Calculate score and certification level
    const score = calculateScore(initiatives);
    const certification_level = getCertificationLevel(score);

    await sustainability.update({
      ...initiatives,
      score,
      certification_level,
      verification_status: 'pending', // Reset to pending after changes
      notes: notes || sustainability.notes
    });

    res.json({
      message: 'Sustainability information updated successfully',
      sustainability
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.submitForVerification = async (req, res) => {
  try {
    const { property_id } = req.params;

    // Verify property ownership
    const property = await Property.findByPk(property_id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (property.provider_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const sustainability = await SustainabilityCertification.findOne({ where: { property_id } });

    if (!sustainability) {
      return res.status(404).json({ error: 'Sustainability information not found' });
    }

    // Auto-verify if score is high enough
    if (sustainability.score >= 50) {
      sustainability.verification_status = 'verified';
    } else {
      sustainability.verification_status = 'pending';
    }

    await sustainability.save();

    res.json({
      message: 'Sustainability certification submitted for verification',
      sustainability
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPropertyBySustainability = async (req, res) => {
  try {
    const { level } = req.query;

    const where = level ? { certification_level: level } : {};

    const certifications = await SustainabilityCertification.findAll({
      where,
      include: {
        association: 'property',
        attributes: ['id', 'name', 'address', 'provider_id']
      }
    });

    res.json(certifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCarbonSavings = async (req, res) => {
  try {
    const { property_id } = req.params;

    const sustainability = await SustainabilityCertification.findOne({ where: { property_id } });

    if (!sustainability) {
      return res.status(404).json({ error: 'Sustainability information not found' });
    }

    // Estimate carbon savings based on initiatives
    let monthlySavings = 0;
    if (sustainability.solar_panels) monthlySavings += 150; // kg CO2/month
    if (sustainability.rainwater_harvesting) monthlySavings += 50;
    if (sustainability.waste_management) monthlySavings += 30;
    if (sustainability.energy_efficient) monthlySavings += 100;
    if (sustainability.carbon_neutral) monthlySavings += 200;

    const yearlySavings = monthlySavings * 12;

    res.json({
      monthly_carbon_savings_kg: monthlySavings,
      yearly_carbon_savings_kg: yearlySavings,
      yearly_carbon_savings_tons: Math.round(yearlySavings / 1000, 2)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
