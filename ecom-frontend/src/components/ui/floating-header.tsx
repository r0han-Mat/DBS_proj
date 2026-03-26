import React from 'react';
import { MenuIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetFooter } from './sheet';
import { Button, buttonVariants } from './button';
import { cn } from '../../lib/utils';
import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export function FloatingHeader() {
	const [open, setOpen] = React.useState(false);
	const { cartCount, activeUserName, clearActiveUser } = useCart();

	const links = [
		{ label: 'Shop', href: '/' },
		{ label: 'Cart', href: '/cart' },
		{ label: 'Users', href: '/users' },
		{ label: 'Admin', href: '/admin' },
	];

	return (
		<header
			className={cn(
				'sticky top-6 z-50 mb-8 w-[98%]',
				'self-center w-full max-w-6xl rounded-full border border-[var(--border)] shadow-2xl transition-all',
				'bg-[var(--bg-elevated)]/90 supports-[backdrop-filter]:bg-[var(--bg-elevated)]/70 backdrop-blur-xl',
			)}
		>
			<nav className="mx-auto flex items-center justify-between p-3 px-6">
				<Link to="/" className="hover:bg-[var(--bg-hover)] flex cursor-pointer items-center gap-2 rounded-full px-6 py-4 duration-100 text-[var(--text-primary)]">
					<p className="font-semibold text-xl tracking-tight">EcomStore</p>
				</Link>
				<div className="hidden items-center gap-2 md:flex">
					{links.map((link) => (
						<NavLink
							key={link.label}
							className={({ isActive }) => cn(buttonVariants({ variant: isActive ? 'secondary' : 'ghost', size: 'default', className: "rounded-full text-lg px-8 py-6 font-bold transition-transform active:scale-95 hover:scale-105 duration-200" }))}
							to={link.href}
						>
							{link.label}
						</NavLink>
					))}
				</div>
				<div className="flex items-center gap-4 pr-2">
                    {activeUserName ? (
                        <div className="hidden md:flex">
                            <Button variant="outline" size="default" onClick={clearActiveUser} title="Click to clear user" className="rounded-full px-7 py-6 text-lg font-semibold shadow-sm hover:scale-105 duration-200">
                                <span className="h-3 w-3 rounded-full bg-green-500 mr-2" />
                                {activeUserName}
                            </Button>
                        </div>
                    ) : (
                        <div className="hidden md:flex">
                            <Link to="/users" className={cn(buttonVariants({ variant: 'outline', size: 'default' }), "rounded-full px-8 py-6 text-lg font-semibold shadow-sm hover:scale-105 duration-200")}>
                                Select User
                            </Link>
                        </div>
                    )}
                    
                    <Link to="/cart" className={cn(buttonVariants({ variant: 'default', size: 'default' }), "relative rounded-full px-6 py-6 text-base font-semibold shadow-md transition-transform active:scale-95 hover:scale-105 duration-200")}>
                        Cart
                        {cartCount > 0 && (
                            <span className="absolute -top-3 -right-3 bg-white text-black text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full shadow-md border-2 border-[var(--bg-elevated)]">
                                {cartCount}
                            </span>
                        )}
                    </Link>

					<Sheet open={open} onOpenChange={setOpen}>
						<Button
							size="icon"
							variant="outline"
							onClick={() => setOpen(!open)}
							className="md:hidden rounded-full"
						>
							<MenuIcon className="size-4" />
						</Button>
						<SheetContent
							className="bg-[var(--bg-elevated)]/95 supports-[backdrop-filter]:bg-[var(--bg-elevated)]/80 gap-0 backdrop-blur-lg border border-[var(--border)]"
							showClose={false}
							side="left"
						>
							<div className="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5">
								{links.map((link) => (
									<NavLink
										key={link.label}
										className={({ isActive }) => cn(buttonVariants({
											variant: isActive ? 'secondary' : 'ghost',
											className: 'justify-start text-lg py-6',
										}))}
										to={link.href}
                                        onClick={() => setOpen(false)}
									>
										{link.label}
									</NavLink>
								))}
							</div>
							<SheetFooter>
                                {activeUserName ? (
                                    <Button variant="outline" onClick={() => { clearActiveUser(); setOpen(false); }}>
                                        Sign Out ({activeUserName})
                                    </Button>
                                ) : (
                                    <Link to="/users" onClick={() => setOpen(false)} className={buttonVariants({ variant: 'outline' })}>
                                        Select User
                                    </Link>
                                )}
							</SheetFooter>
						</SheetContent>
					</Sheet>
				</div>
			</nav>
		</header>
	);
}
