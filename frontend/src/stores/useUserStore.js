import {create} from 'zustand'
import axios from '../lib/axios'
import {toast} from 'react-hot-toast'


const useUserStore = create((set, get) => ({
    user:null,
    loading:false,
    checkingAuth:true,

    signup: async ({name, email, password, confirmPassword}) => {
        set({loading : true})

        if(password != confirmPassword){
            set({loading:false})
            return toast.error("Password do not match")
        }

        try {
            const res = await axios.post("/auth/signup", {name,email,password})
            set({user:res.data, loading:false})
            toast.success("User registered successfully");
        } catch (error) {
            set({loading:false});
            toast.error(error.response.data.message || "An error Occured ")
        }
    },

    login: async (email, password) => {
        set({loading : true})


        try {
            const res = await axios.post("/auth/login", {email,password})
            console.log(res.data)
            set({user:res.data, loading:false})
            toast.success("Login Successfully");
        } catch (error) {
            set({loading:false});
            toast.error(error.response.data.message || "An error Occured ")
        }
    },

    logout: async() => {
        try {
            await axios.post('/auth/logout');
            set({user:null})
        } catch (error) {
            toast.error(error.response?.data?.message || "An error Occured during logout")
        }

    },

    checkAuth: async() => {
        set({checkingAuth:true})
        try {
            const response = await axios.get("/auth/profile")
            set({user:response.data, checkingAuth:false})

        } catch (error) {
            set({checkingAuth:false, user:null})
        }
    }


}))


export default useUserStore;