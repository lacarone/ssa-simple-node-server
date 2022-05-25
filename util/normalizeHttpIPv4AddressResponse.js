/**
 * Returns a URL string from an object received
 * from 'http.createServer(...).address()' method
 */


module.exports = (addressObject) => {
    // Get .env config field or default
    const defaultValue = 0;
    const openWebConsole = (process.env.OPEN_WEB_CONSOLE || defaultValue);

    // Check if field is set to 'false'
    if (openWebConsole === "0" || openWebConsole === 0) {
        return false;
    }
    return true;
} 
