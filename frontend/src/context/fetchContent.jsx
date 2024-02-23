const fetchContent = async (content, setContent, url) => {
    try {
        // Retrieve the authData from sessionStorage and parse it to get the token
        const authData = JSON.parse(sessionStorage.getItem('authData'));
        const token = authData ? authData.token : null;
        console.log('Token from sessionStorage:', token); // Debug: Log the token to ensure it's being retrieved
    
        // Check if the token is null and handle the case appropriately
        if (!token) {
        console.error('No token found in sessionStorage');
        // You can redirect to login page or show an error message here
        return;
        }
    
        // Include the token in the Authorization header
        const response = await fetch(url, {
        method: 'GET', // Explicitly specify the method
        headers: {
            'Content-Type': 'application/json', // Ensure you're setting the content type
            'Authorization': `Bearer ${token}`
        }
        });
    
        if (!response.ok) {
        throw new Error(`Could not fetch ${content}, status: ${response.status}`); // Include the status code in the error message for more context
        }
    
        const data = await response.json();
        setContent(data);
    } catch (error) {
        console.error(`Error fetching ${content}:`, error);
    }
}

export default fetchContent;