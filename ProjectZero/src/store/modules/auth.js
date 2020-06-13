import firebase from 'firebase'
import router from '@/router'

const state = () => ({
    user: null,
    isAuthenticated: false
})

const mutations = {
    setUser(state, payload) {
        state.user = payload
        if (!!payload && !!payload.user)
            state.user.uid = payload.user.uid
    },
    setIsAuthenticated(state, payload) {
        state.isAuthenticated = payload
    }
}


const actions = {
    userLogin({ commit }, { email, password }) {
        this.dispatch('general/setIsLoading')
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(user => {
                commit('setUser', user)
                commit('setIsAuthenticated', true)
                this.dispatch('general/resetIsLoading')
            })
            .then(() => {
                router.push('/home')
            })
            .catch((error) => {
                console.log(error)
                commit('setUser', null)
                commit('setIsAuthenticated', false)
                this.dispatch('general/resetIsLoading')
                router.push('/')
            })
    },

    userSignOut({ commit }) {
        firebase
            .auth()
            .signOut()
            .then(() => {
                commit('setUser', null)
                commit('setIsAuthenticated', false)
                localStorage.clear()
                router.push('/')
            })
            .catch(() => {
                commit('setUser', null)
                commit('setIsAuthenticated', false)
                localStorage.clear()
                router.push('/')
            })
    },

    resetPassword({ commit }, { email }) {
        this.dispatch('general/setIsLoading')
        firebase
            .auth()
            .sendPasswordResetEmail(email)
            .then(() => {
                commit('setUser', null)
                commit('setIsAuthenticated', false)
                this.dispatch('general/resetIsLoading')
                router.push('/')
            })
            .catch(() => {
                commit('setUser', null);
                commit('setIsAuthenticated', false)
                this.dispatch('general/resetIsLoading')
                router.push('/')
            })
    }

    
}

const getters = {
    isAuthenticated(state) {
        return state.user !== null && state.user !== undefined
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
