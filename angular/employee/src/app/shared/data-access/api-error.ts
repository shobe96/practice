export interface ApiError {
    /**
     * HTTP Status code (e.g., 409)
     */
    status?: number;

    /**
     * A short, unique error code (e.g., FK_VIOLATION)
     */
    errorCode?: string;

    /**
     * A readable message for the client/user
     */
    message?: string;

    /**
     * Optional: The specific field causing the issue (e.g., departmentId)
     */
    field?: string;
}