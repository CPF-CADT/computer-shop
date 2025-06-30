import {Link} from 'react-router-dom'
export default function Navigate (){
    return (
        <div className='h-14 flex'>
            <ul className='flex flex-row my-auto gap-15 font-bold text-lg text-gray-700'>
                <li className='hover:text-[#FFA726]'>
                    <Link to={'/'} >Home</Link>
                </li>
                 <li className='hover:text-[#FFA726]'>
                    <Link to={'/service'} >Service</Link>
                </li>
                 <li className='hover:text-[#FFA726]'>
                    <Link to ={'/promotion'}>Promotion</Link>
                </li>
                 <li className='hover:text-[#FFA726]'>
                    <Link to={'/about-us'}>About US</Link>
                </li>
            </ul>
        </div>
    )
}