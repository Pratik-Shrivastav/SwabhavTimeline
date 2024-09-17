const login = async () => {
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    if (!username || !password) {
        console.log("Username and password are required.");
        return;
    }

    const url = "https://localhost:7042/api/User/Login";
    const loginObject = {
        email: username,
        password: password
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginObject)
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result);
            
            if (result.token) {
                console.log("Login successful:", result.message);
                localStorage.setItem('authToken', result.token);
                window.location.href = '/SwabhavTimeline/timeLine.html'; 
            } else {
                console.log("Login failed:", result.message); // Display the failure message
            }
        } else {
            const error = await response.json();
            console.log(`Error: ${response.status} ${response.statusText}`, error.message);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
};
