import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/useAuth';

// Components
import Button from '../components/button';

export default function ManageFriends() {
    const [myID, updateMyID] = useState(null)
    const [loading, updateLoading] = useState(true)
    const [requestsList, updateRequestsList] = useState([])

    const { user } = useAuth()


    // loads the friend requests for the logged in user
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

                // gets the IDs of everyone who sent the logged in user a request
                supabase.rpc('get_friend_requests', { input_user_id })
                    .then(function (result) {
                        const requestIDs = []
                        for (const request of result.data) {
                            requestIDs.push(request.friendid)
                        }

                        // gets the names of everyone who sent a request
                        supabase.from('Users').select('id, UserName').in('id', requestIDs)
                            .then(function (result) {
                                updateRequestsList(result.data)
                                updateLoading(false)
                            })
                    })
            })
    }, [user])

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

        {/* Friends board */}
        {loading == false && (
            <div className="space-y-3">
                <div className="flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    {requestsList.map(function (friend, i) {
                        return (
                            <div key={friend.id} className="px-4 py-3 flex items-center gap-3 border-b border-slate-100 last:border-b-0">
                                <div className="flex-1 flex items-center gap-3">
                                    <span className="font-bold text-[var(--color-forest)]">{i + 1}</span>
                                    <span className="font-semibold text-[var(--color-charcoal)]">{friend.UserName}</span>
                                </div>
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