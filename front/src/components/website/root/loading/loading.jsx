import React, { useState, useEffect } from "react";

const Loading = ({darkMode}) => {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`loading${isLoading ? ' is-loading' : ''}`}>
            <div className="logo">
                { darkMode ? (
                        <img src="https://ik.imagekit.io/z0tzxea0wgx/Cogitum/aitwork_classic_darkmode_JZP8mnNC6?updatedAt=1696434420437" alt="Logo" className="navbar-logo" />
                    ) : (
                        <img src="https://ik.imagekit.io/z0tzxea0wgx/Cogitum/aitwork_classic_lightmode_7loTSqYOy?updatedAt=1696434475079" alt="Logo" className="navbar-logo" />
                    )
                }
            </div>
        </div>
    );
}

export default Loading;
