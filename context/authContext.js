import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, db } from "../firebase.config"
import { doc, getDoc, setDoc } from "firebase/firestore"

export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(undefined)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            // console.log("got user", user)
            if (user) {
                setIsAuthenticated(true)
                setUser(user)
                updateUser(user?.uid)
            } else {
                setIsAuthenticated(false)
                setUser(null)
            }
        })
        return unsub
    }, [])

    const updateUser = async (userId) => {
        const docRef = doc(db, 'users', userId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            let data = docSnap.data()
            setUser({...user, username: data.username, uid: data.userId})
        }
    }

    const login = async (email, password) => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password)
            console.log("user log in : ", response?.user)

            setUser(response?.user)
            setIsAuthenticated(true)

            return { success: true, data: response?.user }
        } catch (e) {
            let message = e.message
            if (message.includes('(auth/invalid-email)')) message = 'Invalid Email'
            if (message.includes('(auth/invalid-credential)')) message = 'Invalid credential'
            return { success: false, message }
        }
    }

    const register = async (email, password, username) => {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password)
            console.log('response.user : ', response?.user)

            setUser(response?.user)
            setIsAuthenticated(true)

            await setDoc(doc(db, 'users', response?.user?.uid), {
                username, 
                userId: response?.user?.uid
            })
            return { success: true, data: response?.user }
        } catch (e) {
            let message = e.message
            if (message.includes('(auth/invalid-email)')) message = 'Invalid email'
            if (message.includes('(auth/email-already-in-use)')) message = 'Email already in use'
            return { success: false, message }
        }
    }

    const logout = async () => {
        try {
            await signOut(auth)
            return {success: true}
        } catch (e) {
            return {success: false, message: e.message, error: e}
        }
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const value = useContext(AuthContext)
    if (!value) {
        throw new Error('useAuth must be wrapped inside AuthContextProvider')
    }
    return value
}