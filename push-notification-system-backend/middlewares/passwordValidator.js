import { check, validationResult } from 'express-validator';

// We define a list of common, weak, or breached passwords to reject
const blacklistedWords = ['password', '123456', 'qwerty'];
const minLength = 8;

// --- 1. Rule Definition (Array of Check Middlewares) ---
// Now using .withMessage() to provide a unique, machine-readable ERROR CODE
const passwordValidationRules = [
    // 1. Min/Max Length
    check('password')
        .isLength({ min: minLength, max: 64 })
        .withMessage('PASSWORD_LENGTH_INVALID'),

    // 2. Uppercase Check (Matches at least one A-Z character)
    check('password')
        .matches(/[A-Z]/)
        .withMessage('PASSWORD_MISSING_UPPERCASE'),

    // 3. Lowercase Check
    check('password')
        .matches(/[a-z]/)
        .withMessage('PASSWORD_MISSING_LOWERCASE'),

    // 4. Digits Check
    check('password')
        .matches(/[0-9]/)
        .withMessage('PASSWORD_MISSING_DIGIT'),

    // 5. Symbols Check (Matches at least one of the specified special characters)
    check('password')
        .matches(/[_!@#$%^&*]/)
        .withMessage('PASSWORD_MISSING_SYMBOL'),

    // 6. No Spaces Check (Matches if NOT containing a whitespace character)
    check('password')
        .not().matches(/\s/)
        .withMessage('PASSWORD_HAS_SPACES'),

    // 7. Blacklist Check (Custom Validator)
    check('password').custom((value) => {
        // Skip check if the value is empty
        if (!value) return true; 
        
        const lowerValue = value.toLowerCase();
        for (const word of blacklistedWords) {
            if (lowerValue.includes(word)) {
                // Throwing the unique error code string
                throw new Error('PASSWORD_IS_COMMON');
            }
        }
        return true;
    }),
];

// --- 2. Contextual Validation (Username Match Middleware) ---
// This remains a manual Express middleware check, returning a specific code.
const contextualUsernameCheck = (req, res, next) => {
    const { password, username } = req.body;
    const lowerPassword = password ? password.toLowerCase() : '';
    const lowerUsername = username ? username.toLowerCase() : null;

    if (lowerUsername && lowerPassword.includes(lowerUsername)) {
        // Returning a specific machine-readable code for the contextual error
        return res.status(400).json({
            error: "Password cannot contain your username or email address.",
            details: 'PASSWORD_CONTAINS_USERNAME'
        });
    }
    next();
};


// --- 3. Error Handling Middleware ---
// This processes the results of all the 'check()' middlewares and returns the code
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Retrieve the specific error code string from the first failed rule
        const errorCode = errors.array({ onlyFirstError: true })[0].msg;

        return res.status(400).json({
            error: "Password does not meet complexity requirements.",
            details: errorCode // Now returns the machine-readable code (e.g., 'PASSWORD_LENGTH_INVALID')
        });
    }
    next();
};

// --- 4. Exported Middleware Arrays ---

/**
 * MANDATORY validation for required password fields (e.g., /register).
 */
export const validatePassword = [
    ...passwordValidationRules,
    contextualUsernameCheck, // Contextual check runs AFTER rule checks
    handleValidationErrors,
];

/**
 * OPTIONAL validation for non-required password fields (e.g., /edit-user).
 */
export const optionalValidatePassword = (req, res, next) => {
    // Check if the password field exists and is a non-empty string
    if (req.body.password && typeof req.body.password === 'string' && req.body.password.trim().length > 0) {
        
        // --- FIX: Correctly Execute the Middleware Chain ---
        let index = 0;
        
        // Define a function that runs the next middleware in the array
        const runNextMiddleware = (err) => {
            if (err) {
                // If an error occurred (like a status set by a previous middleware), stop and pass it on.
                return next(err);
            }
            if (index < validatePassword.length) {
                const currentMiddleware = validatePassword[index++];
                // Run the current middleware, passing the next step of the chain as 'next'
                try {
                    currentMiddleware(req, res, runNextMiddleware);
                } catch (e) {
                    next(e);
                }
            } else {
                // All optional validation steps completed successfully.
                next();
            }
        };

        // Start the execution chain
        runNextMiddleware();
    } else {
        // Password is NOT provided, so skip validation and continue to the route handler.
        next();
    }
};