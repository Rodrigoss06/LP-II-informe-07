import Navbar from '@/components/Navbar/Navbar';
import UserData from '@/components/User';
import React from 'react';
import { useRouter } from 'next/router';
import { useUserStore } from '@/UserStore';

const UserPage = () => {
  const {user_id, setLoggin,setUser_id} = useUserStore((state)=>state)

    const router = useRouter();
    const { id } = router.query;
    if (typeof id === "undefined" && id === undefined) {
        return <div>Loading...</div>;
    }

    return (
        <section>
            <Navbar />
            <h1>{typeof id}</h1>
            <h1>{typeof user_id}</h1>
            <UserData user_id={Number(id)}/>
        </section>
    );
};

export default UserPage;

