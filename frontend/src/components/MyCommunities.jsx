import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Badge from './badge';
import Button from './button';

const PLACES = ['1st', '2nd', '3rd'];
const VISIBLE_ROWS = 4; // rows shown in the scroll list before scrolling

// "My Communities" sub tab on the Community page:
// leaderboard for the selected joined community, then my communities, then joinable ones.
export default function MyCommunities() {
    const [myId, setMyId] = useState(null)
    const [groups, setGroups] = useState([])       // every group: { id, name, memberCount }
    const [mineIds, setMineIds] = useState([])     // ids of groups I have joined
    const [selectedId, setSelectedId] = useState(null)
    const [board, setBoard] = useState([])
    const [loading, setLoading] = useState(true)
    const [boardLoading, setBoardLoading] = useState(false)
    const [error, setError] = useState('')
    const [busyId, setBusyId] = useState(null)     // group being joined/left right now

    // loads my user id, all groups with member counts, and the groups I am in
    useEffect(function () {
        let cancelled = false
        async function load() {
            const { data: id, error: idError } = await supabase.rpc('my_user_id')
            if (cancelled) return
            if (idError || id == null) {
                setError('Could not load your communities.')
                setLoading(false)
                return
            }

            const [all, mine] = await Promise.all([
                supabase.from('groups').select('groupID, GroupName, groupUserLink(count)'),
                supabase.rpc('get_user_groups', { input_user_id: id }),
            ])
            if (cancelled) return
            if (all.error || mine.error) {
                setError('Could not load your communities.')
                setLoading(false)
                return
            }

            const joined = mine.data.map(function (g) { return g.group_id })
            setMyId(id)
            setGroups(all.data.map(function (g) {
                return { id: g.groupID, name: g.GroupName, memberCount: g.groupUserLink[0]?.count ?? 0 }
            }))
            setMineIds(joined)
            setSelectedId(joined[0] ?? null) // open the first joined community
            setLoading(false)
        }
        load()
        return function () { cancelled = true }
    }, [])

    // loads the leaderboard of the selected community
    useEffect(function () {
        if (selectedId == null) {
            setBoard([])
            return
        }
        let cancelled = false
        setBoardLoading(true)
        supabase.rpc('get_group_leaderboard', { input_group_id: selectedId })
            .then(function (result) {
                if (cancelled) return
                if (result.error) setError('Could not load this leaderboard.')
                setBoard(result.data ?? [])
                setBoardLoading(false)
            })
        return function () { cancelled = true }
    }, [selectedId])

    async function handleJoin(group) {
        if (busyId) return
        setBusyId(group.id)
        setError('')
        const { error: joinError } = await supabase.rpc('join_group', { input_user_id: myId, input_group_id: group.id })
        setBusyId(null)
        if (joinError) {
            console.error('Join failed:', joinError)
            setError('Could not join ' + group.name + '. Please try again.')
            return
        }
        setMineIds(function (ids) { return [...ids, group.id] })
        changeCount(group.id, 1)
        setSelectedId(group.id) // show the community just joined
    }

    async function handleLeave(group) {
        if (busyId) return
        if (!window.confirm('Leave "' + group.name + '"?')) return
        setBusyId(group.id)
        setError('')
        const { error: leaveError } = await supabase.rpc('leave_group', { input_group_id: group.id, input_user_id: myId })
        setBusyId(null)
        if (leaveError) {
            console.error('Leave failed:', leaveError)
            setError('Could not leave ' + group.name + '. Please try again.')
            return
        }
        setMineIds(function (ids) { return ids.filter(function (id) { return id !== group.id }) })
        changeCount(group.id, -1)
        if (selectedId === group.id) setSelectedId(null) // close its leaderboard
    }

    function changeCount(groupId, by) {
        setGroups(function (list) {
            return list.map(function (g) { return g.id === groupId ? { ...g, memberCount: g.memberCount + by } : g })
        })
    }

    if (loading) {
        return <p className="text-sm text-[#657065]">Loading…</p>
    }

    const mine = groups.filter(function (g) { return mineIds.includes(g.id) })
    const joinable = groups
        .filter(function (g) { return !mineIds.includes(g.id) })
        .sort(function (a, b) { return b.memberCount - a.memberCount })
    const selected = groups.find(function (g) { return g.id === selectedId })

    const top3 = board.slice(0, 3)
    const rest = board.slice(3)
    const myIndex = board.findIndex(function (p) { return p.userid === myId })
    const me = board[myIndex]
    // ponytail: assumes the list shows VISIBLE_ROWS rows; pinned row may show while yours is partly visible
    const pinMe = myIndex >= 3 + VISIBLE_ROWS

    return (
        <div className="space-y-3">
            {/* Leaderboard of the selected community */}
            {selected && (
                <div className="space-y-3">
                    <div className="flex flex-col">
                        <span className="font-bold">{selected.name}</span>
                        <span className="text-sm font-normal text-[#657065]">{selected.memberCount} members</span>
                    </div>

                    {boardLoading && <p className="text-sm text-[#657065]">Loading…</p>}

                    {!boardLoading && (
                        <div className="space-y-3">
                            <div className="px-4 py-3 bg-[#EAF4E9] border border-emerald-100 rounded-2xl">
                                <div className="flex items-end justify-center gap-3">
                                    <PodiumPlace player={top3[1]} fallback={2} height="h-[84px]" />
                                    <PodiumPlace player={top3[0]} fallback={1} height="h-28" first />
                                    <PodiumPlace player={top3[2]} fallback={3} height="h-14" />
                                </div>
                            </div>

                            {rest.length > 0 && (
                                <div className="flex flex-col bg-white border border-slate-200 rounded-2xl overflow-y-auto max-h-64">
                                    {rest.map(function (player) {
                                        return <Row key={player.userid} player={player} highlight={player.userid === myId} />
                                    })}
                                </div>
                            )}

                            {pinMe && (
                                <div className="flex flex-col rounded-2xl overflow-hidden">
                                    <Row player={me} highlight />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {error && <p className="text-xs text-red-600 text-center">{error}</p>}

            {/* My communities */}
            <div className="flex flex-col">
                <span className="font-bold">My communities</span>
                <span className="text-sm font-normal text-[#657065]">Communities you have joined</span>
            </div>
            <div className="space-y-2.5">
                {mine.length === 0 && <p className="text-xs text-gray-500">You have not joined any communities yet. Join one below.</p>}
                {mine.map(function (group) {
                    return (
                        <CommunityCard key={group.id} group={group} joined selected={group.id === selectedId}>
                            <Button variant="outline" className="shrink-0 rounded-full px-4 text-xs font-bold" onClick={function () { setSelectedId(group.id) }}>
                                View
                            </Button>
                            <Button variant="red" className="shrink-0 rounded-full px-4 text-xs font-bold" onClick={function () { handleLeave(group) }}>
                                {busyId === group.id ? 'Leaving…' : 'Leave'}
                            </Button>
                        </CommunityCard>
                    )
                })}
            </div>

            {/* Joinable communities */}
            <div className="flex flex-col">
                <span className="font-bold">Joinable communities</span>
                <span className="text-sm font-normal text-[#657065]">Find your community. Grow your impact.</span>
            </div>
            <div className="space-y-2.5">
                {joinable.length === 0 && <p className="text-xs text-gray-500">You are in every community.</p>}
                {joinable.map(function (group) {
                    return (
                        <CommunityCard key={group.id} group={group}>
                            <Button variant="primary" className="shrink-0 rounded-full px-4 text-xs font-bold" onClick={function () { handleJoin(group) }}>
                                {busyId === group.id ? 'Joining…' : 'Join'}
                            </Button>
                        </CommunityCard>
                    )
                })}
            </div>
        </div>
    )
}

// one podium step, shows "—" when the place is empty
function PodiumPlace({ player, fallback, height, first }) {
    const label = PLACES[(player?.rank ?? fallback) - 1] ?? PLACES[fallback - 1]
    return (
        <div className="flex-1 flex flex-col items-center gap-1 min-w-0">
            <span className="font-semibold text-[var(--color-charcoal)] truncate max-w-full">{player ? '@' + player.username : '—'}</span>
            <div className={'w-full ' + height + ' [container-type:size] flex flex-col items-center justify-center rounded-t-xl ' + (first ? 'bg-[var(--color-forest)]' : 'bg-white')}>
                <span className={'text-[40cqh] font-bold ' + (first ? 'text-white' : 'text-[var(--color-forest)]')}>{label}</span>
                <span className={'text-[15cqh] ' + (first ? 'text-white' : 'text-[#657065]')}>{player ? player.score + ' pts' : '—'}</span>
            </div>
        </div>
    )
}

// one leaderboard row, green when it is me
function Row({ player, highlight }) {
    return (
        <div className={'px-4 py-3 flex items-center gap-3 border-b last:border-b-0 ' + (highlight ? 'bg-[#EAF4E9] border-[#81C784]' : 'border-slate-100')}>
            <span className="font-bold text-[var(--color-forest)]">{player.rank}</span>
            <span className="font-semibold text-[var(--color-charcoal)] mr-auto">{player.username}</span>
            <div className="flex flex-col items-end">
                <span className="text-sm font-bold">{player.score}</span>
                <span className="text-sm font-normal text-[#657065]">pts</span>
            </div>
        </div>
    )
}

// community card, same layout as the dashboard's community list
function CommunityCard({ group, joined, selected, children }) {
    return (
        <div className={'bg-white p-3 rounded-2xl border flex items-center justify-between gap-3 shadow-xs transition-all ' + (selected ? 'border-[#81C784]' : 'border-gray-100 hover:border-gray-200')}>
            <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-[#E8F5E9] text-[var(--color-forest,#15803d)] font-bold flex items-center justify-center shrink-0">
                    {group.name.charAt(0)}
                </div>
                <div className="space-y-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 leading-none truncate">{group.name}</h4>
                    <p className="text-[11px] text-gray-400 font-medium">{group.memberCount} members</p>
                    {joined && <Badge label="• Joined" />}
                </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">{children}</div>
        </div>
    )
}
