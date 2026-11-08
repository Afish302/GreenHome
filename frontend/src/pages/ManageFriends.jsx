import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/useAuth';

// Components
import Button from '../components/button';

export default function ManageFriends() {
    const [friendsList, updateFriendsList] = useState([])
    const [myID, updateMyID] = useState(null)
    const [loading, updateLoading] = useState(true)

    const { user } = useAuth()


    // loads the friends leaderboard for the  user
    useEffect(function () {
        // stops if nobody is logged in
        if (user == null) {
            return
        }

        // gets the logged in user ID from the Users table
        supabase.from('Users').select('id').eq('email', user.email).single()
            .then(function (result) {
                const input_user_id = result.data.id
                updateMyID(input_user_id)

                // gets the friends leaderboard, including the logged in user
                supabase.rpc('get_friends_leaderboard_with_me', { input_user_id })
                    .then(function (result) {
                        updateFriendsList(result.data)
                        updateLoading(false)
                    })
            })
    }, [user])

    // gets the users row from the list
    const myRow = friendsList.find(function (friend) {
        if (friend.user_id == myID) {
            return true
        }
        return false
    })

    // takes the user out of the list
    const friendsOnly = friendsList.filter(function (friend) {
        if (friend.user_id == myID) {
            return false
        }
        return true
    })

    // removes a friend and takes them off the list
    function removeFriend(friendID) {
        const input_user_id = myID
        const input_friend_id = friendID

        supabase.rpc('remove_friends', { input_user_id, input_friend_id })
            .then(function () {
                const updatedList = friendsList.filter(function (friend) {
                    if (friend.user_id == friendID) {
                        return false
                    }
                    return true
                })
                updateFriendsList(updatedList)
            })
    }

  return (
    <div className="space-y-3">
        <div className="flex items-center">
            <div className="flex flex-col">
                <span className="font-bold">Manage Friends</span>
                <span className="text-sm font-normal text-[#657065]">Friends List</span>
            </div>
            <Button variant="text" className="ml-auto" navigate="/community">Return</Button>
        </div>

        {loading == true && (
            <p className="text-sm text-[#657065]">Loading…</p>
        )}

        {/* Friends Leaderboard */}
        {loading == false && myRow && (
            <div className="space-y-3">
                <div className="flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    {friendsOnly.map(function (friend, i) {
                        return (
                            <div key={friend.user_id} className="px-4 py-3 flex items-center gap-3 border-b border-slate-100 last:border-b-0">
                                <div className="flex-1 flex items-center gap-3">
                                    <span className="font-bold text-[var(--color-forest)]">{i + 1}</span>
                                    <span className="font-semibold text-[var(--color-charcoal)]">{friend.username}</span>
                                </div>
                                <Button variant="text" onClick={function () { removeFriend(friend.user_id) }}>Remove friend</Button>
                                <div className="flex-1 flex flex-col items-end">
                                    <span className="text-sm font-bold">{friend.score}</span>
                                    <span className="text-sm font-normal text-[#657065]">pts</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}
    </div>
  );
}