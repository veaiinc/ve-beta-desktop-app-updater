import React, { useState, useEffect, useContext } from 'react'
import a from './MeetingAnalytics.module.scss'
import DownSvg from '../../../assets/svg/activity/DownSvg'
import ClockSvg from './clock.svg'
import Context from '../../../context/context'
import { ReactComponent as MessageSvg } from './message.svg'
const MeetingAnalytics = ({ meetingId }) => {
    const {
        notes: { getMeetingAnalytics },
    } = useContext(Context)
    const [activeTab, setActiveTab] = useState('Analytics')
    const [expandedSections, setExpandedSections] = useState({
        participants: true,
        highlights: true,
        meetingScore: true,
        openQuestions: false
    })
    const [analyticsData, setAnalyticsData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    // Fetch meeting analytics data
    const fetchMeetingAnalytics = async () => {
        if (!meetingId) {
            setError('No meeting ID provided')
            return
        }
        
        setLoading(true)
        setError(null)
        
        try {
            console.log('Fetching analytics for meetingId:', meetingId)
            
            const [success, data] = await getMeetingAnalytics(meetingId)
            
            if (success) {
                setAnalyticsData(data)
            } else {
                setError(data) // data contains the error message
                console.error('Error fetching analytics:', data)
            }
        } catch (err) {
            setError('Error fetching meeting analytics')
            console.error('Error:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMeetingAnalytics()
    }, [meetingId])

    // Use API data or fallback to sample data
    const participants = analyticsData?.participants || [
        {
            name: 'Gautam',
            talkTime: '3 hr min',
            talkPercentage: '45%',
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
            talkPercentage: '50%',
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
            talkPercentage: '5%',
            participantScore: 65,
            engagement: 85,
            sentiment: 75,
            charisma: 78,
            bias: 68,
            avatar: 'R',
            color: '#10B981'
        }
    ]

    const highlights = analyticsData?.highlights || [
        {
            type: 'Topic',
            time: '2:00',
            engagement: 'Positive',
            description: 'Current lead generation process is heavily manual, requiring automation while maintaining quality',
            icon: <MessageSvg />
        },
        {
            type: 'Key Question',
            time: '22:00',
            engagement: 'Positive',
            description: 'Can the AI agent open Gmail and send personalized emails directly?',
            icon: <MessageSvg />
        },
        {
            type: 'Decision',
            time: '23:00',
            engagement: 'Positive',
            description: 'Shift from complex multi-tool approach to simplified Gmail-based personalized outreach',
            icon: <MessageSvg />
        }
    ]

    const openQuestions = analyticsData?.openQuestions || [
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

    // Get metrics from API data or use defaults
    const metrics = analyticsData?.metrics || {
        engagement: 88,
        sentiment: 88,
        totalParticipants: 3,
        bestScore: 87,
        averageEngagement: 64.4,
        averageSentiment: 64.4,
        averageReadScore: 54.0,
        averageBias: 60.0,
        averageCharisma: 60.0
    }

    const WaveGraph = ({ className }) => (
        <svg className={className} viewBox="0 0 120 40" fill="none">
            <path
                d="M2 20 Q10 10 20 15 T40 18 Q50 12 60 16 T80 14 Q90 8 100 12 T118 15"
                stroke="#4F9EF8"
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
                        <span className={a.statValue}>{metrics.totalParticipants}</span>
                    </span>
                    <span className={a.statItem}>
                        <span className={a.statLabel}>Best Score</span>
                        <span className={a.statValue}>{metrics.bestScore}</span>
                    </span>
                    <span className={a.statItem}>
                        <span className={a.statLabel}>Engagement</span>
                        <span className={a.statValue}>{metrics.engagement}</span>
                    </span>
                    <span className={a.statItem}>
                        <span className={a.statLabel}>Sentiment</span>
                        <span className={a.statValue}>{metrics.sentiment}</span>
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
                              stroke="#4F9EF8" strokeWidth="2" fill="none" />
                        <path d="M50 140 Q100 130 150 135 T250 125 Q300 110 350 115 T450 120 Q500 105 550 110" 
                              stroke="#F59E0B" strokeWidth="2" fill="none" />
                        <path d="M50 160 Q100 150 150 155 T250 145 Q300 130 350 135 T450 140 Q500 125 550 130" 
                              stroke="#8B5CF6" strokeWidth="2" fill="none" />
                        <path d="M50 100 Q100 80 150 90 T250 85 Q300 70 350 75 T450 80 Q500 65 550 70" 
                              stroke="#EF4444" strokeWidth="2" fill="none" />
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
                    <div className={a.legendColor} style={{backgroundColor: '#4F9EF8'}}></div>
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

    // Loading state
    if (loading) {
        return (
            <div className={a.analyticsMainContainer}>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Loading meeting analytics...</p>
                </div>
            </div>
        )
    }

    // Show error banner but continue with dummy data
    const showErrorBanner = error && !loading

    return (
        <div className={a.analyticsMainContainer}>
            {/* Error Banner */}
            {showErrorBanner && (
                <div style={{ 
                    backgroundColor: '#fef2f2', 
                    border: '1px solid #fecaca', 
                    borderRadius: '6px', 
                    padding: '1rem', 
                    margin: '1rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <p style={{ color: '#dc2626', margin: '0', fontSize: '14px' }}>
                            ⚠️ {error}
                        </p>
                        <p style={{ color: '#6b7280', margin: '0.25rem 0 0 0', fontSize: '12px' }}>
                            Showing sample data for demonstration purposes.
                        </p>
                    </div>
                    <button 
                        onClick={fetchMeetingAnalytics}
                        style={{ 
                            padding: '0.5rem 1rem', 
                            backgroundColor: '#4f9ef8', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: 'pointer',
                            fontSize: '12px'
                        }}
                    >
                        Retry
                    </button>
                </div>
            )}
            
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
                            <p className={a.conditionValue}>{metrics.engagement}</p>
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
                            <p className={a.conditionValue}>{metrics.sentiment}</p>
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
                    <span className={`${a.expandIcon} ${expandedSections.participants ? a.expanded : ''}`}><DownSvg /></span>
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
                                    <div className={a.nameTimeRow}>
                                        <h3 className={a.participantName}>{participant.name}</h3>
                                        <div className={a.timeWithIcon}>
                                            <span className={a.talkTime}>{participant.talkTime}</span>
                                            <span className={a.clockIcon}><img src={ClockSvg} alt="clock" /></span>
                                        </div>
                                    </div>
                                    <div className={a.percentageRow}>
                                        <span className={a.percentageLabel}>Talk time percentage</span>
                                        <div className={a.percentageValue}>
                                            <span>{participant.talkPercentage}</span>
                                            <div className={a.percentageIndicator}>
                                                <div className={a.percentageArc} style={{transform: `rotate(${(parseInt(participant.talkPercentage) / 100) * 180}deg)`}}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={a.participantMetrics}>
                                <div className={a.metric}>
                                    <span className={a.metricName}>Participant Score</span>
                                    <div className={a.metricValueWithDot}>
                                        <span className={a.greenDot}>●</span>
                                        <span className={a.metricValue}>{participant.participantScore}</span>
                                    </div>
                                </div>
                                <div className={a.metric}>
                                    <span className={a.metricName}>Engagement</span>
                                    <div className={a.metricValueWithDot}>
                                        <span className={a.greenDot}>●</span>
                                        <span className={a.metricValue}>{participant.engagement}</span>
                                    </div>
                                </div>
                                <div className={a.metric}>
                                    <span className={a.metricName}>Sentiment</span>
                                    <div className={a.metricValueWithDot}>
                                        <span className={a.greenDot}>●</span>
                                        <span className={a.metricValue}>{participant.sentiment}</span>
                                    </div>
                                </div>
                                <div className={a.metric}>
                                    <span className={a.metricName}>Charisma</span>
                                    <div className={a.metricValueWithDot}>
                                        <span className={a.greenDot}>●</span>
                                        <span className={a.metricValue}>{participant.charisma}</span>
                                    </div>
                                </div>
                                <div className={a.metric}>
                                    <span className={a.metricName}>Bias</span>
                                    <div className={a.metricValueWithDot}>
                                        <span className={a.greenDot}>●</span>
                                        <span className={a.metricValue}>{participant.bias}</span>
                                    </div>
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
                    <span className={`${a.expandIcon} ${expandedSections.highlights ? a.expanded : ''}`}><DownSvg /></span>
                </div>
                {expandedSections.highlights && (
                    <div className={a.highlightsContent}>
                        {highlights.map((highlight, index) => (
                            <div key={index} className={a.highlightItem}>
                                <div className={a.highlightHeader}>
                                    <div className={a.highlightType} data-type={highlight.type.toLowerCase().replace(' ', '-')}>
                                    <span className={a.highlightIcon}>{highlight.icon}</span>
                                     {highlight.type}
                                    </div>
                                    <span className={a.highlightTime}>
                                        {highlight.time}
                                    </span>
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
                    <span className={`${a.expandIcon} ${expandedSections.meetingScore ? a.expanded : ''}`}><DownSvg /></span>
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
                                <span className={a.totalParticipants}>Total Participants Count {metrics.totalParticipants}</span>
                            </div>
                            <div className={a.averageMetrics}>
                                <div className={a.avgMetric}>
                                    <span className={a.avgLabel}>Average engagement</span>
                                    <span className={a.avgValue}>{metrics.averageEngagement}</span>
                                </div>
                                <div className={a.avgMetric}>
                                    <span className={a.avgLabel}>Average sentiment</span>
                                    <span className={a.avgValue}>{metrics.averageSentiment}</span>
                                </div>
                                <div className={a.avgMetric}>
                                    <span className={a.avgLabel}>Average read score</span>
                                    <span className={a.avgValue}>{metrics.averageReadScore}</span>
                                </div>
                                <div className={a.avgMetric}>
                                    <span className={a.avgLabel}>Average bias</span>
                                    <span className={a.avgValue}>{metrics.averageBias}</span>
                                </div>
                                <div className={a.avgMetric}>
                                    <span className={a.avgLabel}>Average charisma</span>
                                    <span className={a.avgValue}>{metrics.averageCharisma}</span>
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
                    <span className={`${a.expandIcon} ${expandedSections.openQuestions ? a.expanded : ''}`}><DownSvg /></span>
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