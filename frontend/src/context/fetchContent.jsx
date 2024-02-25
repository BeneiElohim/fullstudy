const fetchContent = async (content, setContent, url, setIsLoading) => {
    if (setIsLoading) setIsLoading(true);
    try {
        // Retrieve the authData from sessionStorage and parse it to get the token
        const authData = JSON.parse(sessionStorage.getItem('authData'));
        const token = authData ? authData.token : null;
        console.log('Token from sessionStorage:', token); // Debug: Log the token to ensure it's being retrieved
    
        if (!token) {
        console.error('No token found in sessionStorage');
        return;
        }
    
        // Include the token in the Authorization header
        const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
        });
    
        if (!response.ok) {
        throw new Error(`Could not fetch ${content}, status: ${response.status}`);
        }
    
        const data = await response.json();
        setContent(data);
    } catch (error) {
        console.error(`Error fetching ${content}:`, error);
    } finally {
        if (setIsLoading) setIsLoading(false);
    }
}

export default fetchContent;