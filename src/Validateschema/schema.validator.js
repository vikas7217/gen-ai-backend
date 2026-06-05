const Validator = require("schema-validator");

function validateSchema(schema) {
  return async (req, res, next) => {
    try {
      const validator = new Validator(schema);

      const isValidSchema = await validator.check(req.body);
      console.log("Validation result:", isValidSchema);
      if (isValidSchema._error) {
        const errors = {};
        Object.keys(isValidSchema).forEach((key) => {
          if (key !== "_error") {
            errors[key] = Object.values(isValidSchema[key]).map(
              (err) => err.message,
            );
          }
        });
        return res.status(400).json({
          success: false,
          errors,
        });
      }
      next();
    } catch (validationError) {
      return { valid: false, errors, validationError };
    }
  };
}
module.exports = validateSchema;
