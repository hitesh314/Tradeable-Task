const handleProgramExceptions = (error, res) => {
  if (error && error.code === 11000 && error.keyPattern) {
    // Extract field names involved in the unique constraint violation
    const uniqueFields = Object.keys(error.keyPattern);

    // Construct a custom message
    const message = `The following field(s) are already taken and must be unique: ${uniqueFields.join(', ')}.`;

    res.status(400).json({ error: message });
  } else {
    // Handle other errors
    res.status(400).json({ error: error.message });
  }
};

module.exports = handleProgramExceptions;