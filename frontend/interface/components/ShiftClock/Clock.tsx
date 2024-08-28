import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
    const [time, setTime] = useState<string>(new Date().toLocaleTimeString());

    useEffect(() => {
        const timerId = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);

        return () => clearInterval(timerId);
    }, []);

    return (
        <div className="flex items-center justify-center">
            <div className="text-6xl font-mono text-black">
                {time}
            </div>
        </div>
    );
};

export default Clock;