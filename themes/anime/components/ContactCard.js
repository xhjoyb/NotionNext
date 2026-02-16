import FlipCard from '@/components/FlipCard'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

const ContactCard = () => {
  if (!JSON.parse(siteConfig('ANIME_CONTACT_CARD', true, CONFIG))) {
    return null
  }

  const contactUrl = siteConfig('ANIME_CONTACT_URL', 'https://github.com', CONFIG)
  const title1 = siteConfig('ANIME_CONTACT_TITLE_1', '✨ 联系我', CONFIG)
  const title2 = siteConfig('ANIME_CONTACT_TITLE_2', '一起交流吧~', CONFIG)
  const title3 = siteConfig('ANIME_CONTACT_TITLE_3', '点击前往 →', CONFIG)

  return (
    <div className='relative h-32'>
      <FlipCard
        className='cursor-pointer p-6 border rounded-2xl anime-glass border-pink-200/50 dark:border-purple-500/30 shadow-lg shadow-pink-200/30 dark:shadow-purple-500/20'
        frontContent={
          <div className='h-full relative overflow-hidden'>
            <div className='absolute top-2 right-2 text-3xl animate-bounce'>💌</div>
            <h2 className='font-bold text-2xl text-gray-800 dark:text-white drop-shadow-lg'>
              {title1}
            </h2>
            <h3 className='pt-2 text-gray-600 dark:text-gray-300 text-sm'>
              {title2}
            </h3>
          </div>
        }
        backContent={
          <SmartLink href={contactUrl}>
            <div className='font-bold text-lg h-full flex items-center justify-center text-gray-800 dark:text-white hover:scale-105 transition-transform duration-300'>
              <span className='mr-2'>🌸</span>
              {title3}
              <span className='ml-2'>🌸</span>
            </div>
          </SmartLink>
        }
      />
    </div>
  )
}

export default ContactCard
