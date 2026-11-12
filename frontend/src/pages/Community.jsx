import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, TrendingUp, TrendingDown, Leaf, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/useAuth';

// Components
import ProgressCircle from '../components/ProgressCircle';
import MetricCard from '../components/MetricCard';
import Badge from '../components/badge';
import Button from '../components/button';
import OptionCard from '../components/OptionCard';
import IconButton from '../components/IconButton';

export default function Community() {
    const [mainTab, updateMainTab] = useState('leaderboard')
    const [subTab, updateSubTab] = useState('global')
    const [extendList, updateExtendList] = useState(false)
    const [friendsList, updateFriendsList] = useState([])
    const [myID, updateMyID] = useState(null)
    const [friendsLoading, updateFriendsLoading] = useState(true)
    const [globalLoading, updateGlobalLoading] = useState(true)
    const [globalList, updateGlobalList] = useState([])
    const [globalPlacement, updateGlobalPlacement] = useState(null)

    const { user } = useAuth()


    // loads the friends leaderboard
    useEffect(function () {
        // stops if nobody is logged in
        if (user == null) {
            return
        }

        // gets the logged in user ID from the Users table
        supabase
            .from('Users')
            .select('id')
            .eq('email', user.email)
            .single()
            .then(function (result) {
                // stops if the user was not found
                if (result.data == null) {
                    return
                }

                const input_user_id = result.data.id
                updateMyID(input_user_id)

                // gets the friends leaderboard
                supabase.rpc('get_friends_leaderboard_with_me', { input_user_id })
                    .then(function (result) {
                        updateFriendsList(result.data)
                        updateFriendsLoading(false)
                    })
            })
    }, [user])



    // loads the global leaderboard/ top scores
    useEffect(function () {
        // stops if nobody is logged in
        if (user == null) {
            return
        }

        // gets the top 10 scores
        supabase.rpc('get_top_scores', { input_limit: 10 })
            .then(function (result) {
                console.log('top scores', result)
                updateGlobalList(result.data)
                updateGlobalLoading(false)
            })
    }, [user])

    // loads the users global placement
    useEffect(function () {
        // stops if nobody is logged in
        if (user == null) {
            return
        }

        // gets the user ID
        supabase
            .from('Users')
            .select('id')
            .eq('email', user.email)
            .single()
            .then(function (result) {
                // stops if the user was not found
                if (result.data == null) {
                    return
                }

                const input_user_id = result.data.id

                // gets the users global placement, score and username
                supabase.rpc('get_leaderboard_placement', { input_user_id })
                    .then(function (result) {
                        console.log('placement', result)
                        updateGlobalPlacement(result.data[0])
                    })
            })
    }, [user])
    // shows the top 5 friends or all of them when the list is extended
    let friendLeaderboard = friendsList.slice(0, 5)
    if (extendList) {
        friendLeaderboard = friendsList
    }

    // gets the logged in users row from the leaderboard
    const myRow = friendsList.find(function (friend) {
        return friend.user_id == myID
    })

    return (
        <div className="space-y-3">
            <div className="flex flex-col">
                <span className="font-bold">Community</span>
                <span className="text-sm font-normal text-[#657065]">Community</span>
            </div>

            {/* Main tabs */}
            <div className="grid grid-cols-2 gap-2 flex-1 ml-auto">
                <OptionCard label="Leaderboard" className={'!py-3 ' + (mainTab == 'leaderboard' && '!bg-[var(--color-forest)] !text-white') + ' ' + (mainTab != 'leaderboard' && '!bg-[#EDF1ED] !text-[#707970]')} selected={mainTab == 'leaderboard'} onClick={function () { updateMainTab('leaderboard') }} />
                <OptionCard label="Local Events" className={'!py-3 ' + (mainTab == 'local events' && '!bg-[var(--color-forest)] !text-white') + ' ' + (mainTab != 'local events' && '!bg-[#EDF1ED] !text-[#707970]')} selected={mainTab == 'local events'} onClick={function () { updateMainTab('local events') }} />
            </div>

            {/* Leaderboard tab */}
            {mainTab == 'leaderboard' && (
                <div className="space-y-3">
                    {/* Sub tabs */}
                    <div className="grid grid-cols-3 gap-2 flex-1 ml-auto">
                        <OptionCard label="Global" className={'!py-3 ' + (subTab == 'global' && '!bg-[var(--color-forest)] !text-white')} selected={subTab == 'global'} onClick={function () { updateSubTab('global') }} />
                        <OptionCard label="Friends" className={'!py-3 ' + (subTab == 'friends' && '!bg-[var(--color-forest)] !text-white')} selected={subTab == 'friends'} onClick={function () { updateSubTab('friends') }} />
                        <OptionCard label="My Communities" className={'!py-3 ' + (subTab == 'my communities' && '!bg-[var(--color-forest)] !text-white')} selected={subTab == 'my communities'} onClick={function () { updateSubTab('my communities') }} />
                    </div>

                    {/* Global */}
                    {subTab == 'global' && (
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <div className="flex flex-col">
                                    <span className="font-bold">Growing Greener, together</span>
                                    <span className="text-sm font-normal text-[#657065]">Eco</span>
                                </div>
                            </div>

                            {globalLoading == true && (
                                <p className="text-sm text-[#657065]">Loading…</p>
                            )}

                            {/* Global Leaderboard */}
                            {globalLoading == false && (
                                <div className="space-y-3">
                                    <div className="px-4 py-3 bg-[#EAF4E9] border border-emerald-100 rounded-2xl">
                                        <div className="flex items-end justify-center gap-3">
                                            <div className="flex-1 flex flex-col items-center gap-1">
                                                <span className="font-semibold text-[var(--color-charcoal)]">@{globalList[1].username}</span>
                                                <div className="w-full h-[84px] [container-type:size] flex flex-col items-center justify-center bg-white rounded-t-xl">
                                                    <span className="text-[40cqh] font-bold text-[var(--color-forest)]">2nd</span>
                                                    <span className="text-[15cqh] text-[#657065]">{globalList[1].score} pts</span>
                                                </div>
                                            </div>
                                            <div className="flex-1 flex flex-col items-center gap-1">
                                                <span className="font-semibold text-[var(--color-charcoal)]">@{globalList[0].username}</span>
                                                <div className="w-full h-28 [container-type:size] flex flex-col items-center justify-center bg-[var(--color-forest)] rounded-t-xl">
                                                    <span className="text-[40cqh] font-bold text-white">1st</span>
                                                    <span className="text-[15cqh] text-white">{globalList[0].score} pts</span>
                                                </div>
                                            </div>
                                            <div className="flex-1 flex flex-col items-center gap-1">
                                                <span className="font-semibold text-[var(--color-charcoal)]">@{globalList[2].username}</span>
                                                <div className="w-full h-14 [container-type:size] flex flex-col items-center justify-center bg-white rounded-t-xl">
                                                    <span className="text-[40cqh] font-bold text-[var(--color-forest)]">3rd</span>
                                                    <span className="text-[15cqh] text-[#657065]">{globalList[2].score} pts</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden">
                                        {globalList.slice(3, 6).map(function (player, i) {
                                            return (
                                                <div key={player.user_id} className="px-4 py-3 flex items-center gap-3 border-b border-slate-100 last:border-b-0">
                                                    <span className="font-bold text-[var(--color-forest)]">{i + 4}</span>
                                                    <span className="font-semibold text-[var(--color-charcoal)] mr-auto">{player.username}</span>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-sm font-bold">{player.score}</span>
                                                        <span className="text-sm font-normal text-[#657065]">pts</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {globalPlacement && myRow && (
                                        <div className="flex flex-col bg-[#EAF4E9] border border-[#81C784] rounded-2xl overflow-hidden">
                                            <div className="px-4 py-3 flex items-center gap-3">
                                                <span className="font-bold text-[var(--color-forest)]">{globalPlacement.rank}</span>
                                                <span className="font-semibold text-[var(--color-charcoal)] mr-auto">{myRow.username}</span>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-sm font-bold">{myRow.score}</span>
                                                    <span className="text-sm font-normal text-[#657065]">pts</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    {/* Friends tab */}
                    {subTab == 'friends' && (
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <div className="flex flex-col">
                                    <span className="font-bold">Friends</span>
                                    <span className="text-sm font-normal text-[#657065]">Friends List</span>
                                </div>
                                <Button variant="secondary" className="ml-auto" navigate="/addFriends">Add Friends</Button>
                                <Button variant="text" className="ml-3" navigate="/manageFriends">Manage friends</Button>
                            </div>

                            {friendsLoading == true && (
                                <p className="text-sm text-[#657065]">Loading…</p>
                            )}
                            {/* Friends Leaderboard */}
                            {friendsLoading == false && myRow && (
                                <div className="space-y-3">
                                    <div className="flex flex-col bg-[#EAF4E9] border border-[#81C784] rounded-2xl overflow-hidden">
                                        <div className="px-4 py-3 flex items-center gap-3">
                                            <span className="font-bold text-[var(--color-forest)]">{myRow.rank}</span>
                                            <span className="font-semibold text-[var(--color-charcoal)] mr-auto">{myRow.username}</span>
                                            <div className="flex flex-col items-end">
                                                <span className="text-sm font-bold">{myRow.score}</span>
                                                <span className="text-sm font-normal text-[#657065]">pts</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden">
                                        {friendLeaderboard.map(function (friend, i) {
                                            return (
                                                <div key={friend.user_id} className="px-4 py-3 flex items-center gap-3 border-b border-slate-100 last:border-b-0">
                                                    <span className="font-bold text-[var(--color-forest)]">{i + 1}</span>
                                                    <span className="font-semibold text-[var(--color-charcoal)] mr-auto">{friend.username}</span>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-sm font-bold">{friend.score}</span>
                                                        <span className="text-sm font-normal text-[#657065]">pts</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {/* Extend Leaderboard button */}
                                    <IconButton className="mx-auto" onClick={function () { updateExtendList(!extendList) }}>
                                        {extendList == false && <ChevronDown color="#657065" size={20} />}
                                        {extendList == true && <ChevronUp color="#657065" size={20} />}
                                    </IconButton>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Local Events tab */}
            {mainTab == 'local events' && (
                <div>
                </div>
            )}
        </div>
    );
}