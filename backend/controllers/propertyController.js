const { Property } = require('../models');
const { Op } = require('sequelize');

const parseCoordinate = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsedValue = parseFloat(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

const parseInteger = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsedValue = parseInt(value, 10);
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

const parseBoolean = (value) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
  }

  return Boolean(value);
};

const parseOptionalString = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = String(value).trim();
  return normalized || null;
};

const normalizePreferredFor = (value) => {
  const normalized = parseOptionalString(value);

  if (!normalized) {
    return null;
  }

  const allowedValues = ['student', 'working_professional', 'intern', 'family', 'traveler'];
  return allowedValues.includes(normalized) ? normalized : null;
};

const listReviewAttributes = [
  'id',
  'rating',
  'cleanliness',
  'wifi_rating',
  'food_rating',
  'safety_rating',
  'rule_flexibility_rating',
  'createdAt'
];

const detailReviewAttributes = [
  'id',
  'rating',
  'title',
  'comment',
  'cleanliness',
  'wifi_rating',
  'food_rating',
  'safety_rating',
  'rule_flexibility_rating',
  'communication',
  'location',
  'value',
  'createdAt'
];

const buildPropertyPayload = (body, currentProperty = null) => ({
  name: body.name ?? currentProperty?.name,
  type: body.type ?? currentProperty?.type,
  address: body.address ?? currentProperty?.address,
  base_price: body.base_price ?? currentProperty?.base_price,
  amenities: Array.isArray(body.amenities) ? body.amenities : (currentProperty?.amenities ?? []),
  description: body.description === undefined ? currentProperty?.description : body.description,
  image_url: body.image_url === undefined ? currentProperty?.image_url : body.image_url,
  latitude: body.latitude === undefined ? currentProperty?.latitude : parseCoordinate(body.latitude),
  longitude: body.longitude === undefined ? currentProperty?.longitude : parseCoordinate(body.longitude),
  commute_landmark: body.commute_landmark === undefined
    ? currentProperty?.commute_landmark
    : parseOptionalString(body.commute_landmark),
  commute_minutes: body.commute_minutes === undefined
    ? currentProperty?.commute_minutes
    : parseInteger(body.commute_minutes),
  preferred_for: body.preferred_for === undefined
    ? currentProperty?.preferred_for
    : normalizePreferredFor(body.preferred_for),
  move_in_assurance: body.move_in_assurance === undefined
    ? currentProperty?.move_in_assurance
    : parseBoolean(body.move_in_assurance),
  assurance_notes: body.assurance_notes === undefined
    ? currentProperty?.assurance_notes
    : parseOptionalString(body.assurance_notes)
});

exports.createProperty = async (req, res) => {
  try {
    const propertyData = buildPropertyPayload(req.body);

    if (!propertyData.name || !propertyData.type || !propertyData.address || !propertyData.base_price) {
      return res.status(400).json({ error: 'Name, type, address, and base_price are required' });
    }

    const property = await Property.create({
      ...propertyData,
      provider_id: req.user.id
    });

    res.status(201).json({ message: 'Property created successfully', property });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProperties = async (req, res) => {
  try {
    const {
      type,
      location,
      destination,
      preferredFor,
      maxCommute,
      minPrice,
      maxPrice,
      north,
      south,
      east,
      west
    } = req.query;

    const where = {};
    const andConditions = [];

    if (type && type !== 'all') {
      where.type = type;
    }

    if (minPrice || maxPrice) {
      where.base_price = {};

      if (minPrice) {
        where.base_price[Op.gte] = parseFloat(minPrice);
      }

      if (maxPrice) {
        where.base_price[Op.lte] = parseFloat(maxPrice);
      }
    }

    if (location && location !== 'all') {
      andConditions.push({
        [Op.or]: [
          { address: { [Op.like]: `%${location}%` } },
          { commute_landmark: { [Op.like]: `%${location}%` } }
        ]
      });
    }

    if (destination && destination !== 'all') {
      andConditions.push({
        commute_landmark: { [Op.like]: `%${destination}%` }
      });
    }

    if (preferredFor && preferredFor !== 'all') {
      where.preferred_for = preferredFor;
    }

    if (maxCommute) {
      where.commute_minutes = { [Op.lte]: parseInt(maxCommute, 10) };
    }

    if (north || south) {
      where.latitude = {};

      if (south) {
        where.latitude[Op.gte] = parseFloat(south);
      }

      if (north) {
        where.latitude[Op.lte] = parseFloat(north);
      }
    }

    if (east || west) {
      where.longitude = {};

      if (west) {
        where.longitude[Op.gte] = parseFloat(west);
      }

      if (east) {
        where.longitude[Op.lte] = parseFloat(east);
      }
    }

    if (andConditions.length > 0) {
      where[Op.and] = andConditions;
    }

    const properties = await Property.findAll({
      where,
      include: [
        {
          association: 'rooms',
          attributes: ['id', 'room_type', 'total_beds', 'available_beds', 'price_per_night']
        },
        {
          association: 'reviews',
          attributes: listReviewAttributes,
          required: false
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id, {
      include: [
        {
          association: 'rooms',
          attributes: ['id', 'room_type', 'total_beds', 'available_beds', 'price_per_night']
        },
        {
          association: 'provider',
          attributes: ['id', 'name', 'email']
        },
        {
          association: 'reviews',
          attributes: detailReviewAttributes,
          include: [
            {
              association: 'guest',
              attributes: ['id', 'name']
            }
          ],
          separate: true,
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (property.provider_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const propertyData = buildPropertyPayload(req.body, property);

    await property.update(propertyData);

    res.json({ message: 'Property updated successfully', property });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (property.provider_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await property.destroy();
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
