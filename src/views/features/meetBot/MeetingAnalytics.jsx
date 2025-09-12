import React, { useState } from 'react'
import a from './MeetingAnalytics.module.scss'

const MeetingAnalytics = () => {
    const [activeTab, setActiveTab] = useState('Analytics')
    const [expandedSections, setExpandedSections] = useState({
        participants: true,
        highlights: true,
        meetingScore: true,
        openQuestions: false
    })

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    // Sample data for the interface
    const participants = [
        {
            name: 'Gautam',
            talkTime: '3 hr min',
            talkPercentage: 45,
            participantScore: 85,
            engagement: 88,
            sentiment: 78,
            charisma: 82,
            bias: 75,
            avatar: 'G',
            color: '#F59E0B'
        },
        {
            name: 'Madhuri Bafna',
            talkTime: '5.44 min',
            talkPercentage: 50,
            participantScore: 80,
            engagement: 85,
            sentiment: 75,
            charisma: 78,
            bias: 72,
            avatar: 'M',
            color: '#EF4444'
        },
        {
            name: 'Ramya',
            talkTime: '2.40 min',
            talkPercentage: 5,
            participantScore: 65,
            engagement: 85,
            sentiment: 75,
            charisma: 78,
            bias: 68,
            avatar: 'R',
            color: '#10B981'
        }
    ]

    const highlights = [
        {
            type: 'Topic',
            time: '2:00',
            engagement: 'Positive',
            description: 'Current lead generation process is heavily manual, requiring automation while maintaining quality'
        },
        {
            type: 'Key Question',
            time: '22:00',
            engagement: 'Positive',
            description: 'Can the AI agent open Gmail and send personalized emails directly?'
        },
        {
            type: 'Question',
            time: '23:00',
            engagement: 'Positive',
            description: 'Shift from complex multi-tool approach to simplified Gmail-based personalized outreach'
        }
    ]

    const openQuestions = [
        {
            participant: 'Yashwant',
            time: '15:43 PM',
            question: 'How will email verification be handled for publicly available email addresses?'
        },
        {
            participant: 'Gautam',
            time: '15:43 PM',
            question: 'What parameters determine the quality of prospects from Apollo results?'
        }
    ]

    const WaveGraph = ({ className }) => (
        <svg className={className} viewBox="0 0 120 40" fill="none">
            <path
                d="M2 20 Q10 10 20 15 T40 18 Q50 12 60 16 T80 14 Q90 8 100 12 T118 15"
                stroke="#3B82F6"
                strokeWidth="2"
                fill="none"
            />
        </svg>
    )

    const MainChart = () => (
        <div className={a.mainChart}>
            <div className={a.chartHeader}>
                <div className={a.chartStats}>
                    <span className={a.statItem}>
                        <span className={a.statLabel}>Total Participants Count</span>
                        <span className={a.statValue}>3</span>
                    </span>
                    <span className={a.statItem}>
                        <span className={a.statLabel}>Best Score</span>
                        <span className={a.statValue}>87</span>
                    </span>
                    <span className={a.statItem}>
                        <span className={a.statLabel}>Engagement</span>
                        <span className={a.statValue}>86</span>
                    </span>
                    <span className={a.statItem}>
                        <span className={a.statLabel}>Sentiment</span>
                        <span className={a.statValue}>85</span>
                    </span>
                </div>
            </div>
            <div className={a.chartContainer}>
                <div className={a.yAxis}>
                    <span>90</span>
                    <span>80</span>
                    <span>70</span>
                    <span>60</span>
                    <span>50</span>
                </div>
                <div className={a.chartArea}>
                    <svg viewBox="0 0 600 200" className={a.chartSvg}>
                        {/* Grid lines */}
                        <defs>
                            <pattern id="grid" width="60" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 60 0 L 0 0 0 40" fill="none" stroke="#2A2D30" strokeWidth="1" opacity="0.3"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                        
                        {/* Chart lines */}
                        <path d="M50 120 Q100 100 150 110 T250 105 Q300 90 350 95 T450 100 Q500 85 550 90" 
                              stroke="#3B82F6" strokeWidth="3" fill="none" />
                        <path d="M50 140 Q100 130 150 135 T250 125 Q300 110 350 115 T450 120 Q500 105 550 110" 
                              stroke="#F59E0B" strokeWidth="3" fill="none" />
                        <path d="M50 160 Q100 150 150 155 T250 145 Q300 130 350 135 T450 140 Q500 125 550 130" 
                              stroke="#8B5CF6" strokeWidth="3" fill="none" />
                        <path d="M50 100 Q100 80 150 90 T250 85 Q300 70 350 75 T450 80 Q500 65 550 70" 
                              stroke="#EF4444" strokeWidth="3" fill="none" />
                    </svg>
                    <div className={a.xAxis}>
                        <span>0:00</span>
                        <span>6:00</span>
                        <span>12:00</span>
                        <span>24:00</span>
                        <span>30:00</span>
                        <span>36:00</span>
                    </div>
                </div>
            </div>
            <div className={a.chartLegend}>
                <div className={a.legendItem}>
                    <div className={a.legendColor} style={{backgroundColor: '#3B82F6'}}></div>
                    <span>Gautam</span>
                </div>
                <div className={a.legendItem}>
                    <div className={a.legendColor} style={{backgroundColor: '#F59E0B'}}></div>
                    <span>Madhuri Bafna</span>
                </div>
                <div className={a.legendItem}>
                    <div className={a.legendColor} style={{backgroundColor: '#8B5CF6'}}></div>
                    <span>Ramya</span>
                </div>
                <div className={a.legendItem}>
                    <div className={a.legendColor} style={{backgroundColor: '#EF4444'}}></div>
                    <span>Sentiment</span>
                </div>
            </div>
        </div>
    )

    return (
        <div className={a.analyticsMainContainer}>
            {/* Header */}
            {/* <div className={a.header}>
                <div className={a.titleSection}>
                    <h1 className={a.meetingTitle}>Product interview</h1>
                    <p className={a.meetingDate}>Wednesday, March 13, 2024</p>
                </div>
                <div className={a.tabNavigation}>
                    <button 
                        className={`${a.tab} ${activeTab === 'Summary' ? a.active : ''}`}
                        onClick={() => setActiveTab('Summary')}
                    >
                        Summary
                    </button>
                    <button 
                        className={`${a.tab} ${activeTab === 'Analytics' ? a.active : ''}`}
                        onClick={() => setActiveTab('Analytics')}
                    >
                        Analytics
                    </button>
                </div>
            </div> */}

            {/* Metric Cards */}
            <div className={a.analyticsContainerOne}>
                <div className={a.analyticsContainerOneItem}>
                    <div className={a.conditionContainer}>
                        <p className={a.metricLabel}>Engagement</p>
                        <div className={a.conditionValueContainer}>
                            <p className={a.conditionValue}>88</p>
                            <p className={a.conditionValueText}>Good</p>
                        </div>
                    </div>
                    <div className={a.conditionGraph}>
                        <WaveGraph className={a.waveGraph} />
                    </div>
                </div>
                <div className={a.analyticsContainerOneItem}>
                    <div className={a.conditionContainer}>
                        <p className={a.metricLabel}>Sentimental</p>
                        <div className={a.conditionValueContainer}>
                            <p className={a.conditionValue}>88</p>
                            <p className={a.conditionValueText}>Good</p>
                        </div>
                    </div>
                    <div className={a.conditionGraph}>
                        <WaveGraph className={a.waveGraph} />
                    </div>
                </div>
            </div>

            {/* Participants Section */}
            <div className={a.section}>
                <div className={a.sectionHeader} onClick={() => toggleSection('participants')}>
                    <h2 className={a.sectionTitle}>Participants</h2>
                    <span className={`${a.expandIcon} ${expandedSections.participants ? a.expanded : ''}`}>▼</span>
                </div>
                {expandedSections.participants && (
                    <div className={a.participantsContent}>
                        <div className={a.participantsGrid}>
                    {participants.map((participant, index) => (
                        <div key={index} className={a.participantCard}>
                            <div className={a.participantHeader}>
                                <div className={a.participantAvatar} style={{backgroundColor: participant.color}}>
                                    {participant.avatar}
                                </div>
                                <div className={a.participantInfo}>
                                    <h3 className={a.participantName}>{participant.name}</h3>
                                    <div className={a.talkTimeInfo}>
                                        <span className={a.talkTime}>{participant.talkTime}</span>
                                        <span className={a.talkPercentage}>{participant.talkPercentage}%</span>
                                    </div>
                                </div>
                            </div>
                            <div className={a.participantMetrics}>
                                <div className={a.metric}>
                                    <span className={a.metricName}>Participant Score</span>
                                    <span className={a.metricValue}>{participant.participantScore}</span>
                                </div>
                                <div className={a.metric}>
                                    <span className={a.metricName}>Engagement</span>
                                    <span className={a.metricValue}>{participant.engagement}</span>
                                </div>
                                <div className={a.metric}>
                                    <span className={a.metricName}>Sentiment</span>
                                    <span className={a.metricValue}>{participant.sentiment}</span>
                                </div>
                                <div className={a.metric}>
                                    <span className={a.metricName}>Charisma</span>
                                    <span className={a.metricValue}>{participant.charisma}</span>
                                </div>
                                <div className={a.metric}>
                                    <span className={a.metricName}>Bias</span>
                                    <span className={a.metricValue}>{participant.bias}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Chart */}
            <MainChart />

            {/* Highlights Section */}
            <div className={a.section}>
                <div className={a.sectionHeader} onClick={() => toggleSection('highlights')}>
                    <h2 className={a.sectionTitle}>HIGHLIGHTS</h2>
                    <span className={`${a.expandIcon} ${expandedSections.highlights ? a.expanded : ''}`}>▼</span>
                </div>
                {expandedSections.highlights && (
                    <div className={a.highlightsContent}>
                        {highlights.map((highlight, index) => (
                            <div key={index} className={a.highlightItem}>
                                <div className={a.highlightHeader}>
                                    <div className={a.highlightType} data-type={highlight.type.toLowerCase().replace(' ', '-')}>
                                        {highlight.type}
                                    </div>
                                    <span className={a.highlightTime}>{highlight.time}</span>
                                    <div className={a.engagementBadge}>
                                        <span>Engagement:</span>
                                        <span className={a.engagementValue}>{highlight.engagement}</span>
                                    </div>
                                </div>
                                <p className={a.highlightDescription}>{highlight.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Meeting Score Section */}
            <div className={a.section}>
                <div className={a.sectionHeader} onClick={() => toggleSection('meetingScore')}>
                    <h2 className={a.sectionTitle}>Meeting Score</h2>
                    <span className={`${a.expandIcon} ${expandedSections.meetingScore ? a.expanded : ''}`}>▼</span>
                </div>
                {expandedSections.meetingScore && (
                    <div className={a.meetingScoreContent}>
                        <div className={a.scoreCard}>
                            <div className={a.scoreHeader}>
                                <div className={a.participantAvatars}>
                                    {participants.map((p, i) => (
                                        <div key={i} className={a.smallAvatar} style={{backgroundColor: p.color}}>
                                            {p.avatar}
                                        </div>
                                    ))}
                                </div>
                                <span className={a.totalParticipants}>Total Participants Count 3</span>
                            </div>
                            <div className={a.averageMetrics}>
                                <div className={a.avgMetric}>
                                    <span className={a.avgLabel}>Average engagement</span>
                                    <span className={a.avgValue}>64.4</span>
                                </div>
                                <div className={a.avgMetric}>
                                    <span className={a.avgLabel}>Average sentiment</span>
                                    <span className={a.avgValue}>64.4</span>
                                </div>
                                <div className={a.avgMetric}>
                                    <span className={a.avgLabel}>Average read score</span>
                                    <span className={a.avgValue}>54.0</span>
                                </div>
                                <div className={a.avgMetric}>
                                    <span className={a.avgLabel}>Average bias</span>
                                    <span className={a.avgValue}>60.0</span>
                                </div>
                                <div className={a.avgMetric}>
                                    <span className={a.avgLabel}>Average charisma</span>
                                    <span className={a.avgValue}>60.0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Open Questions Section */}
            <div className={a.section}>
                <div className={a.sectionHeader} onClick={() => toggleSection('openQuestions')}>
                    <h2 className={a.sectionTitle}>Open Questions</h2>
                    <span className={`${a.expandIcon} ${expandedSections.openQuestions ? a.expanded : ''}`}>▼</span>
                </div>
                {expandedSections.openQuestions && (
                    <div className={a.openQuestionsContent}>
                        {openQuestions.map((question, index) => (
                            <div key={index} className={a.questionItem}>
                                <div className={a.questionHeader}>
                                    <div className={a.questionAvatar}>
                                        {question.participant.charAt(0)}
                                    </div>
                                    <div className={a.questionMeta}>
                                        <span className={a.questionParticipant}>{question.participant}</span>
                                        <span className={a.questionTime}>{question.time}</span>
                                    </div>
                                </div>
                                <p className={a.questionText}>{question.question}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MeetingAnalytics