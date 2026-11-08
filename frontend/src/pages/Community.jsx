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
    const [loading, updateLoading] = useState(true)

    const { user } = useAuth()


    // loads the friends leaderboard
    useEffect(function () {
        // stops if nobody is logged in
        if (user == null) {
            return
        }

        // gets the logged in user ID from the Users table
        supabase.from('Users').select('id').eq('email', user.email).single()
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
                        updateLoading(false)
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
            <OptionCard label="Leaderboard" className={mainTab == 'leaderboard' ? '!py-3 !bg-[var(--color-forest)] !text-white' : '!py-3 !bg-[#EDF1ED] !text-[#707970]'} selected={mainTab == 'leaderboard'} onClick={function () { updateMainTab('leaderboard') }} />
            <OptionCard label="Local Events" className={mainTab == 'local events' ? '!py-3 !bg-[var(--color-forest)] !text-white' : '!py-3 !bg-[#EDF1ED] !text-[#707970]'} selected={mainTab == 'local events'} onClick={function () { updateMainTab('local events') }} />
        </div>

        {/* Leaderboard tab */}
        {mainTab == 'leaderboard' && (
            <div className="space-y-3">
                {/* Sub tabs */}
                <div className="grid grid-cols-3 gap-2 flex-1 ml-auto">
                    <OptionCard label="Global" className={subTab == 'global' ? '!py-3 !bg-[var(--color-forest)] !text-white' : '!py-3'} selected={subTab == 'global'} onClick={function () { updateSubTab('global') }} />
                    <OptionCard label="Friends" className={subTab == 'friends' ? '!py-3 !bg-[var(--color-forest)] !text-white' : '!py-3'} selected={subTab == 'friends'} onClick={function () { updateSubTab('friends') }} />
                    <OptionCard label="My Communities" className={subTab == 'my communities' ? '!py-3 !bg-[var(--color-forest)] !text-white' : '!py-3'} selected={subTab == 'my communities'} onClick={function () { updateSubTab('my communities') }} />
                </div>

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

                        {loading == true && (
                            <p className="text-sm text-[#657065]">Loading…</p>
                        )}
                        {/* Friends Leaderboard */}
                        {loading == false && myRow && (
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