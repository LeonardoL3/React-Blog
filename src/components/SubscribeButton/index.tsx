import styles from './styles.module.scss'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'

interface SubscribeButtonProps {
    priceId: string,

}

export function SubscribeButton({priceId}: SubscribeButtonProps){
    const { data: session } = useSession() 
    const { push } = useRouter()

    async function handleSubscribe(){
        if (!session){
            signIn('github')
            return
        }


        if (session.activeSubscription){
            push('/posts')
            return
        }

        try {
            const response = await api.post('/subscribe')
            const stripe = await getStripeJs()

            await stripe.redirectToCheckout({sessionId : response.data.session})


        }catch(err) {
            alert(err.message)
        }

    }

    return (
        <button
        type="button"
        className={styles.subscribeButton}
        onClick={handleSubscribe}
        >
            Subscribe now
        </button>
    )
}