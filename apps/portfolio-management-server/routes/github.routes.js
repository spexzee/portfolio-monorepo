const express = require('express');
const router = express.Router();

// GitHub GraphQL API endpoint
const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

// Fetch GitHub contributions using GraphQL
router.get('/contributions/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const token = process.env.GITHUB_TOKEN;

        if (!token) {
            // Return simulated data if no token
            return res.json({
                success: true,
                simulated: true,
                contributions: generateSimulatedData()
            });
        }

        const query = `
            query($username: String!) {
                user(login: $username) {
                    contributionsCollection {
                        contributionCalendar {
                            totalContributions
                            weeks {
                                contributionDays {
                                    contributionCount
                                    date
                                    contributionLevel
                                }
                            }
                        }
                    }
                }
            }
        `;

        const response = await fetch(GITHUB_GRAPHQL_API, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: { username }
            })
        });

        const data = await response.json();

        if (data.errors) {
            console.error('GitHub API Error:', data.errors);
            return res.json({
                success: true,
                simulated: true,
                contributions: generateSimulatedData()
            });
        }

        const calendar = data.data?.user?.contributionsCollection?.contributionCalendar;

        if (!calendar) {
            return res.json({
                success: true,
                simulated: true,
                contributions: generateSimulatedData()
            });
        }

        // Flatten contributions to simple array
        const contributions = [];
        calendar.weeks.forEach(week => {
            week.contributionDays.forEach(day => {
                // Convert GitHub's level to 0-4 scale
                const levelMap = {
                    'NONE': 0,
                    'FIRST_QUARTILE': 1,
                    'SECOND_QUARTILE': 2,
                    'THIRD_QUARTILE': 3,
                    'FOURTH_QUARTILE': 4
                };
                contributions.push({
                    date: day.date,
                    count: day.contributionCount,
                    level: levelMap[day.contributionLevel] || 0
                });
            });
        });

        res.json({
            success: true,
            simulated: false,
            totalContributions: calendar.totalContributions,
            contributions
        });

    } catch (error) {
        console.error('Error fetching GitHub contributions:', error);
        res.json({
            success: true,
            simulated: true,
            contributions: generateSimulatedData()
        });
    }
});

// Generate simulated contribution data as fallback
function generateSimulatedData() {
    const contributions = [];
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

module.exports = router;
