import React, { useMemo, useState, useEffect } from 'react';

interface ContributionDay {
    date: string;
    count: number;
    level: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const GitHubContributionGrid: React.FC = () => {
    const [contributions, setContributions] = useState<ContributionDay[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSimulated, setIsSimulated] = useState(false);
    const [totalContributions, setTotalContributions] = useState(0);

    useEffect(() => {
        const fetchContributions = async () => {
            try {
                const response = await fetch(`${API_URL}/api/github/contributions/spexzee`);
                const data = await response.json();

                if (data.success && data.contributions) {
                    setContributions(data.contributions);
                    setIsSimulated(data.simulated || false);
                    setTotalContributions(data.totalContributions || 0);
                }
            } catch (error) {
                console.error('Failed to fetch contributions:', error);
                setContributions(generateFallbackData());
                setIsSimulated(true);
            } finally {
                setLoading(false);
            }
        };

        fetchContributions();
    }, []);

    const getColor = (level: number) => {
        const colors = [
            'bg-[#161b22]',
            'bg-[#0e4429]',
            'bg-[#006d32]',
            'bg-[#26a641]',
            'bg-[#39d353]',
        ];
        return colors[level] || colors[0];
    };

    const weeks = useMemo(() => {
        const result: ContributionDay[][] = [];
        const data = contributions.slice(-364);

        for (let i = 0; i < 52; i++) {
            const weekData = data.slice(i * 7, (i + 1) * 7);
            if (weekData.length > 0) {
                result.push(weekData);
            }
        }
        return result;
    }, [contributions]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

    if (loading) {
        return (
            <div className="p-4 md:p-6 rounded-xl bg-[#0d1117]/90 backdrop-blur-sm border border-[#30363d] animate-pulse">
                <div className="h-[100px] md:h-[140px] flex items-center justify-center text-[#7d8590] text-sm">
                    Loading contributions...
                </div>
            </div>
        );
    }

    return (
        <a
            href="https://github.com/spexzee"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 md:p-6 rounded-xl bg-[#0d1117]/90 backdrop-blur-sm border border-[#30363d] hover:border-[#915eff] transition-all duration-300"
        >
            {/* Title with contribution count */}
            <div className="flex justify-between items-center mb-3">
                <span className="text-[#c9d1d9] text-sm md:text-base font-medium">
                    {totalContributions > 0 ? `${totalContributions.toLocaleString()} contributions in the last year` : 'GitHub Contributions'}
                </span>
                {isSimulated && (
                    <span className="text-[#7d8590] text-[10px] bg-[#30363d] px-2 py-0.5 rounded">preview</span>
                )}
            </div>

            {/* Month labels */}
            <div className="flex mb-1 ml-8 md:ml-10">
                {months.map((month) => (
                    <span
                        key={month}
                        className="text-[9px] md:text-[11px] text-[#7d8590] flex-1"
                    >
                        {month}
                    </span>
                ))}
            </div>

            <div className="flex gap-[2px] md:gap-[3px]">
                {/* Day labels */}
                <div className="flex flex-col gap-[2px] md:gap-[3px] mr-1 md:mr-2">
                    {days.map((day, i) => (
                        <span key={i} className="text-[9px] md:text-[11px] text-[#7d8590] h-[12px] md:h-[16px] flex items-center">
                            {day}
                        </span>
                    ))}
                </div>

                {/* Contribution grid - responsive squares */}
                <div className="flex gap-[2px] md:gap-[3px] flex-1">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-[2px] md:gap-[3px] flex-1">
                            {week.map((day, dayIndex) => (
                                <div
                                    key={`${weekIndex}-${dayIndex}`}
                                    className={`aspect-square w-full max-w-[12px] md:max-w-[16px] rounded-[2px] md:rounded-[3px] ${getColor(day.level)}`}
                                    title={`${day.count} contributions on ${day.date}`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between mt-3">
                <p className="text-[#7d8590] text-xs">@spexzee on GitHub</p>
                <div className="flex items-center gap-1">
                    <span className="text-[9px] md:text-[11px] text-[#7d8590] mr-1">Less</span>
                    {[0, 1, 2, 3, 4].map((level) => (
                        <div
                            key={level}
                            className={`w-[10px] h-[10px] md:w-[14px] md:h-[14px] rounded-[2px] ${getColor(level)}`}
                        />
                    ))}
                    <span className="text-[9px] md:text-[11px] text-[#7d8590] ml-1">More</span>
                </div>
            </div>
        </a>
    );
};

function generateFallbackData(): ContributionDay[] {
    const contributions: ContributionDay[] = [];
    const today = new Date();

    for (let i = 364; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        const random = Math.random();
        let level = 0;
        let count = 0;

        if (random > 0.35) {
            if (random > 0.9) { level = 4; count = Math.floor(Math.random() * 10) + 10; }
            else if (random > 0.75) { level = 3; count = Math.floor(Math.random() * 5) + 6; }
            else if (random > 0.55) { level = 2; count = Math.floor(Math.random() * 3) + 3; }
            else { level = 1; count = Math.floor(Math.random() * 2) + 1; }
        }

        contributions.push({
            date: date.toISOString().split('T')[0],
            count,
            level
        });
    }

    return contributions;
}

export default GitHubContributionGrid;
