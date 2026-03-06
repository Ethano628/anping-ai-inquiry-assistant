'use client';

import { useEffect, useState } from 'react';

interface ScoreRingProps {
    score: number;
    size?: number;
}

export default function ScoreRing({ score, size = 120 }: ScoreRingProps) {
    const [animatedScore, setAnimatedScore] = useState(0);

    // 颜色编码
    const getColor = (s: number) => {
        if (s >= 70) return '#10B981';
        if (s >= 40) return '#F59E0B';
        return '#EF4444';
    };

    const getLabel = (s: number) => {
        if (s >= 70) return '高意向真实买家 ✓';
        if (s >= 40) return '中等意向，需进一步沟通';
        return '低意向 / 疑似垃圾询盘';
    };

    // 动画效果
    useEffect(() => {
        setAnimatedScore(0);
        const duration = 1200;
        const steps = 60;
        const increment = score / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= score) {
                setAnimatedScore(score);
                clearInterval(timer);
            } else {
                setAnimatedScore(Math.round(current));
            }
        }, duration / steps);
        return () => clearInterval(timer);
    }, [score]);

    const color = getColor(score);
    const label = getLabel(score);
    const radius = (size - 12) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (animatedScore / 100) * circumference;

    return (
        <div className="flex items-center gap-5">
            {/* 环形图 */}
            <div className="relative shrink-0" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="-rotate-90">
                    {/* 背景环 */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#E5E7EB"
                        strokeWidth="8"
                        fill="none"
                    />
                    {/* 进度环 */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={color}
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - progress}
                        className="transition-all duration-100"
                    />
                </svg>
                {/* 中心数字 */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[28px] font-bold" style={{ color, fontFamily: "'Sora', sans-serif" }}>
                        {animatedScore}
                    </span>
                </div>
            </div>

            {/* 说明文字 */}
            <div>
                <p className="text-[14px] font-semibold mb-1" style={{ color }}>
                    {label}
                </p>
            </div>
        </div>
    );
}
