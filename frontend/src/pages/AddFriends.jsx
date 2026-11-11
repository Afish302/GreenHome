import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/useAuth';

// Components
import Button from '../components/button';

export default function AddFriends() {
    const [myID, updateMyID] = useState(null)
    const [loading, updateLoading] = useState(true)
    const [requestsList, updateRequestsList] = useState([])
    const [searchName, updateSearchName] = useState('')

    const { user } = useAuth()


    // loads the friend requests for the user
    useEffect(function () {
        // checks for login
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
                const input_user_id = result.data.id
                updateMyID(input_user_id)

                // gets the ID of everyone who sent the logged in user a request
                supabase.rpc('get_friend_requests', { input_user_id })
                    .then(function (result) {
                        const requestIDs = []
                        for (const request of result.data) {
                            requestIDs.push(request.friendid)
                        }

                        // gets the names of everyone who sent a request
                        supabase
                            .from('Users')
                            .select('id, UserName')
                            .in('id', requestIDs)
                            .then(function (result) {
                                updateRequestsList(result.data)
                                updateLoading(false)
                            })
                    })
            })
    }, [user])

    // accepts a friend request and takes them off the list
    function acceptFriend(friendID) {
        const input_user_id = myID
        const input_friend_id = friendID

        supabase.rpc('accept_friend', { input_user_id, input_friend_id })
            .then(function () {
                const updatedList = requestsList.filter(function (friend) {
                    if (friend.id == friendID) {
                        return false
                    }
                    return true
                })
                updateRequestsList(updatedList)
            })
    }

    // sends a friend request to the user with the typed username
    function sendRequest() {
        // gets the ID of the user with that username
        supabase
        .from('Users')
        .select('id')
        .eq('UserName', searchName)
        .single()
            .then(function (result) {
                console.log(result)

                // stops if the user was not found
                if (result.data == null) {
                    return
                }

                const input_user_id1 = myID
                const input_user_id2 = result.data.id

                // sends the request
                supabase.rpc('add_friend', { input_user_id1, input_user_id2 })
                    .then(function (result) {
                        console.log(result)
                        updateSearchName('')
                    })
            })
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center">
                <div className="flex flex-col">
                    <span className="font-bold">Add Friends</span>
                    <span className="text-sm font-normal text-[#657065]">Friend requests</span>
                </div>
                <Button variant="text" className="ml-auto" navigate="/community">Return</Button>
            </div>
            {/* Friend request send bar*/}
            <div className="flex items-center gap-3">
                <input
                    type="text"
                    value={searchName}
                    onChange={function (e) { updateSearchName(e.target.value) }}
                    placeholder="Enter username"
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-2xl bg-white"
                />
                <Button variant="primary" onClick={sendRequest}>Send request</Button>
            </div>

            {loading == true && (
                <p className="text-sm text-[#657065]">Loading…</p>
            )}

            {/* Friend request board */}
            {loading == false && (
                <div>
                    <div className="flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden">
                        {requestsList.map(function (friend, i) {
                            return (
                                <div key={friend.id} className="px-4 py-3 flex items-center gap-3 border-b border-slate-100 last:border-b-0">
                                    <div className="flex-1 flex items-center gap-3">
                                        <span className="font-bold text-[var(--color-forest)]">{i + 1}</span>
                                        <span className="font-semibold text-[var(--color-charcoal)]">{friend.UserName}</span>
                                    </div>
                                    <Button variant="text" onClick={function () { acceptFriend(friend.id) }}>Add as friend</Button>
                                    <div className="flex-1"></div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}