'use client'

import { useState, useEffect, cloneElement } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
	ChevronRight,
	LayoutDashboard,
	Users,
	Hotel,
	Plane,
	Bus,
	User,
	UserRoundPlus,
	Database,
	BookUser,
	Utensils,
	BarChartHorizontal,
	Bath,
	Flag,
	View,
	Keyboard,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { CommonAccordion, CommonTooltip } from '@/components'
import { Navbar } from './Navbar'

export default function Layout({ children }) {
	const router = useRouter()
	const [sidebarToggle, setSidebarToggle] = useState(false)

	

	const path = usePathname()
	const defaultRoutes = [
		{
			name: 'Dashboard',
			path: '/dashboard',
			icon: <LayoutDashboard />,
		},
		{
			name: 'Users',
			path: '/dashboard/users',
			icon: <Users />,
		},
	]
	const routes = [
		{
			name: 'Hotels',
			path: '/dashboard/hotels',
			icon: <Hotel />,
		},
		{
			name: 'Umrahs',
			path: '/dashboard/umrahs',
			icon: <Plane />,
		},
		{
			name: 'Transportations',
			path: '/dashboard/transportations',
			icon: <Bus />,
		},
	]
	const finance = [
		{
			name: 'Chart of Accounts',
			path: '/dashboard/chart-of-accounts',
			icon: <Keyboard />,
		},
		{
			name: 'Transactions',
			path: '/dashboard/transactions',
			icon: <BarChartHorizontal />,
		},
	]
	const datasets = [
		{
			name: 'Clients',
			path: '/dashboard/clients',
			icon: <User />,
		},
		{
			name: 'Vendors',
			path: '/dashboard/vendors',
			icon: <UserRoundPlus />,
		},
		{
			name: 'Hotels',
			path: '/dashboard/hotelsManagement',
			icon: <Hotel />,
		},
		{
			name: 'Transportation',
			path: '/dashboard/transportation',
			icon: <Bus />,
		},
		{
			name: 'Employees',
			path: '/dashboard/employees',
			icon: <BookUser />,
		},
		{
			name: 'Meal Plan',
			path: '/dashboard/meal-plan',
			icon: <Utensils />,
		},
		{
			name: 'Reservation Status',
			path: '/dashboard/reservation-status',
			icon: <BarChartHorizontal />,
		},
		{
			name: 'Room Type',
			path: '/dashboard/room-type',
			icon: <Bath />,
		},
		{
			name: 'Nationality',
			path: '/dashboard/nationality',
			icon: <Flag />,
		},
		{
			name: 'Room View',
			path: '/dashboard/room-view',
			icon: <View />,
		},
		{
			name: 'Transaction Codes',
			path: '/dashboard/transaction-code',
			icon: <Keyboard />,
		},
	]
	if (true) {
		return (
			<main className='min-h-screen'>
				<header className='flex h-[100px] w-full items-center bg-red-100 border-b border-gray-300'>
					<Navbar />
				</header>
				<main className='flex min-h-[calc(100vh-100px)]'>
					<nav
						className={cn(
							{
								'w-[250px]': sidebarToggle,
								'w-[72px]': !sidebarToggle,
							},
							'overflow-hidden transition-all',
						)}>
						<ul
							className='sidebar space-y-2  overflow-y-auto p-3'
							style={{
								maxHeight: 'calc(100vh - 100px)',
							}}>
							<li
								className='flex justify-end rounded-md bg-blue-500 p-3 text-white'
								key={0}>
								<CommonTooltip
									trigger={
										<ChevronRight
											className={cn('cursor-pointer transition-transform', {
												'rotate-180': sidebarToggle,
											})}
											onClick={() => setSidebarToggle((prev) => !prev)}
										/>
									}>
									{sidebarToggle ? 'Contract Sidebar' : 'Expand Sidebar'}
								</CommonTooltip>
							</li>
							{defaultRoutes.map((route, i) => (
								<li key={i + 1}>
									<Link
										className={cn(
											{
												'bg-gray-100': path === route.path,
											},
											'flex cursor-pointer items-center justify-start gap-2 rounded-md p-3 transition-colors  hover:bg-gray-100',
										)}
										href={route.path}>
										<CommonTooltip
											trigger={cloneElement(route.icon, {
												className: cn('max-w-[24px] min-w-[24px] flex-1'),
											})}>
											{route.name}
										</CommonTooltip>
										<span
											className={cn('transition-all', {
												invisible: !sidebarToggle,
												visible: sidebarToggle,
											})}>
											{route.name}
										</span>
									</Link>
								</li>
							))}
							<CommonAccordion
								accordions={[
									{
										label: sidebarToggle ? ' Entries' : <Keyboard />,
										content: (
											<>
												{routes.map((route, i) => (
													<li key={i + 1}>
														<Link
															className={cn(
																{
																	'bg-gray-100':
																		path === route.path,
																},
																'flex cursor-pointer items-center justify-start gap-2 rounded-md p-3 transition-colors  hover:bg-gray-100',
															)}
															href={route.path}>
															<CommonTooltip
																trigger={cloneElement(route.icon, {
																	className: cn(
																		'max-w-[24px] min-w-[24px] flex-1',
																	),
																})}>
																{route.name}
															</CommonTooltip>
															<span
																className={cn('transition-all', {
																	invisible: !sidebarToggle,
																	visible: sidebarToggle,
																})}>
																{route.name}
															</span>
														</Link>
													</li>
												))}
											</>
										),
									},
									{
										label: sidebarToggle ? 'Finance' : <BarChartHorizontal />,
										content: (
											<>
												{finance.map((route, i) => (
													<li key={i + 1}>
														<Link
															className={cn(
																{
																	'bg-gray-100':
																		path === route.path,
																},
																'flex cursor-pointer items-center justify-start gap-2 rounded-md p-3 transition-colors  hover:bg-gray-100',
															)}
															href={route.path}>
															<CommonTooltip
																trigger={cloneElement(route.icon, {
																	className: cn(
																		'max-w-[24px] min-w-[24px] flex-1',
																	),
																})}>
																{route.name}
															</CommonTooltip>
															<span
																className={cn('transition-all', {
																	invisible: !sidebarToggle,
																	visible: sidebarToggle,
																})}>
																{route.name}
															</span>
														</Link>
													</li>
												))}
											</>
										),
									},
									{
										label: sidebarToggle ? 'Data Sets' : <Database />,
										content: (
											<>
												{datasets.map((route, i) => (
													<li key={i + 1}>
														<Link
															className={cn(
																{
																	'bg-gray-100':
																		path === route.path,
																},
																'flex cursor-pointer items-center justify-start gap-2 rounded-md p-3 transition-colors  hover:bg-gray-100',
															)}
															href={route.path}>
															<CommonTooltip
																trigger={cloneElement(route.icon, {
																	className: cn(
																		'max-w-[24px] min-w-[24px] flex-1',
																	),
																})}>
																{route.name}
															</CommonTooltip>
															<span
																className={cn('transition-all', {
																	invisible: !sidebarToggle,
																	visible: sidebarToggle,
																})}>
																{route.name}
															</span>
														</Link>
													</li>
												))}
											</>
										),
									},
								]}
							/>

							{/* <li
								style={{
									display: 'flex',
									alignItems: 'center',
									marginLeft: '12px',
									marginTop: '32px',
									gap: '12px',
								}}>
								<CommonTooltip
									trigger={cloneElement(<Database />, {
										className: cn('max-w-[24px] min-w-[24px] flex-1'),
									})}>
									Data Sets
								</CommonTooltip>
								<span
									className={cn('transition-all', {
										invisible: !sidebarToggle,
										visible: sidebarToggle,
									})}
									style={{
										fontSize: '18px',
										fontWeight: 500,
										letterSpacing: '0.025em',
										lineHeight: '1.25rem',
									}}>
									Data Sets
								</span>
							</li> */}
						</ul>
					</nav>
					<main className='flex flex-1 border-l border-gray-300 p-4'>{children}</main>
				</main>
			</main>
		)
	}
	return <></>
}
