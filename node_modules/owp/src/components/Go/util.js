function makeGoTimelineNodeColor(sid) {
    // 주의
    if (sid === 'D012002') {
        return { event: { stroke: '#000000' }, shape: { fill: '#FFFF00' } };
    }

    // 심각
    if (sid === 'D012003') {
        return { shape: { fill: '#FF0000' } };
    }

    return { shape: { fill: '#0000FF' } };
}

export const makeGoTimelineModel = (data = []) =>
    data.map((node = {}) => ({
        event: node['OWP_ProcessAlarm.AlarmNM'],
        color: makeGoTimelineNodeColor(node['OWP_ProcessAlarm.AlarmSID']),
        date: node['OWP_ProcessAlarm.ADATE'],
    }));
