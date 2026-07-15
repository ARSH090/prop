-- AFX Seed Data - Prop Firms, Brokers, Deals, and Reviews

-- Insert Sample Prop Firms
INSERT INTO firms (slug, name, type, category, logo_url, country, countries_allowed, platforms, max_allocation, years_active, rating, review_count, website_url, affiliate_url, is_featured, is_verified, description, rules, status) VALUES

('ftmo', 'FTMO', 'prop_firm', ARRAY['forex', 'futures'], 'https://via.placeholder.com/200?text=FTMO', 'CZ', ARRAY['IN', 'US', 'UK', 'EU'], ARRAY['MT4', 'MT5'], 200000, 10, 4.7, 342, 'https://ftmo.com', 'https://ftmo.com/ref/anurajfx', true, true, 'Largest prop firm with 200k max allocation and 80% profit split. Known for strict rules but transparent operations.', 
'{"profit_target": "10%", "max_drawdown": "5%", "daily_loss": "3%", "profit_split": "80%", "steps": 2, "duration": "60 days", "re_entry": "allowed"}', 'active'),

('topstep', 'TopStep Trader', 'prop_firm', ARRAY['forex', 'futures'], 'https://via.placeholder.com/200?text=TopStep', 'US', ARRAY['IN', 'US', 'UK', 'AU'], ARRAY['NinjaTrader', 'cTrader'], 150000, 8, 4.5, 289, 'https://topsteptrader.com', 'https://topsteptrader.com/ref/anuraj', true, true, 'US-based prop firm with flexible rules and strong community support. Funded traders get up to 150k accounts.',
'{"profit_target": "8%", "max_drawdown": "4%", "daily_loss": "2.5%", "profit_split": "75%", "steps": 1, "duration": "30 days", "re_entry": "allowed"}', 'active'),

('5ers', '5ers', 'prop_firm', ARRAY['forex', 'futures', 'crypto'], 'https://via.placeholder.com/200?text=5ers', 'UK', ARRAY['IN', 'US', 'EU', 'AU'], ARRAY['MT5', 'cTrader'], 100000, 6, 4.6, 215, 'https://5ers.com', 'https://5ers.com/ref/anurajfx', true, true, 'UK regulated prop firm with crypto trading access. Known for fair dealing desk and quick payouts.',
'{"profit_target": "10%", "max_drawdown": "5%", "daily_loss": "3%", "profit_split": "85%", "steps": 2, "duration": "45 days", "re_entry": "allowed"}', 'active'),

('traders-trust', 'Traders Trust', 'prop_firm', ARRAY['forex'], 'https://via.placeholder.com/200?text=TrustTraders', 'EU', ARRAY['IN', 'US', 'EU', 'UK'], ARRAY['MT4', 'MT5'], 50000, 5, 4.3, 178, 'https://traderstrust.com', 'https://traderstrust.com/ref/anuraj', false, true, 'European prop firm with lower entry costs. Popular with retail traders starting out.',
'{"profit_target": "5%", "max_drawdown": "3%", "daily_loss": "2%", "profit_split": "70%", "steps": 1, "duration": "30 days", "re_entry": "allowed"}', 'active'),

('axismarkets', 'Axis Markets', 'prop_firm', ARRAY['forex', 'futures'], 'https://via.placeholder.com/200?text=Axis', 'SG', ARRAY['IN', 'AU', 'SG', 'HK'], ARRAY['MT5', 'cTrader'], 80000, 4, 4.4, 156, 'https://axismarkets.com', 'https://axismarkets.com/ref/anurajfx', false, true, 'Asia-focused prop firm with great support for Indian traders. Competitive rules and fast funding.',
'{"profit_target": "8%", "max_drawdown": "4%", "daily_loss": "2.5%", "profit_split": "80%", "steps": 1, "duration": "45 days", "re_entry": "allowed"}', 'active'),

('fundedtrader', 'Funded Trader Program', 'prop_firm', ARRAY['forex', 'futures'], 'https://via.placeholder.com/200?text=Funded', 'US', ARRAY['IN', 'US', 'EU'], ARRAY['MT4', 'MT5'], 120000, 7, 4.2, 198, 'https://fundedtrader.com', 'https://fundedtrader.com/ref/anuraj', false, true, 'Newcomer with competitive rates and active community. Growing reputation in the industry.',
'{"profit_target": "6%", "max_drawdown": "3.5%", "daily_loss": "2%", "profit_split": "75%", "steps": 1, "duration": "60 days", "re_entry": "allowed"}', 'active'),

('luxcapital', 'LUX Capital', 'prop_firm', ARRAY['forex', 'crypto'], 'https://via.placeholder.com/200?text=LuxCapital', 'EU', ARRAY['IN', 'US', 'EU', 'UK'], ARRAY['MT5', 'cTrader'], 200000, 3, 4.1, 142, 'https://luxcapital.io', 'https://luxcapital.io/ref/anurajfx', false, true, 'Crypto-focused prop firm with forex overlay. Innovative features and high leverage.',
'{"profit_target": "12%", "max_drawdown": "6%", "daily_loss": "4%", "profit_split": "80%", "steps": 2, "duration": "30 days", "re_entry": "allowed"}', 'active'),

('propfirms-pro', 'PropFirms Pro', 'prop_firm', ARRAY['forex', 'futures'], 'https://via.placeholder.com/200?text=ProFirms', 'UK', ARRAY['IN', 'US', 'EU'], ARRAY['MT4', 'MT5', 'cTrader'], 150000, 2, 4.0, 89, 'https://propfirmspro.com', 'https://propfirmspro.com/ref/anuraj', false, false, 'Emerging prop firm with transparent operations and good reviews so far.',
'{"profit_target": "10%", "max_drawdown": "5%", "daily_loss": "3%", "profit_split": "80%", "steps": 2, "duration": "60 days", "re_entry": "allowed"}', 'active'),

('elite-traders', 'Elite Traders Fund', 'prop_firm', ARRAY['futures'], 'https://via.placeholder.com/200?text=Elite', 'US', ARRAY['US', 'EU', 'UK'], ARRAY['NinjaTrader', 'thinkorswim'], 250000, 6, 4.5, 203, 'https://elitetraders.io', 'https://elitetraders.io/ref/anurajfx', false, true, 'Futures-focused prop firm. Ideal for day traders and advanced trading strategies.',
'{"profit_target": "15%", "max_drawdown": "8%", "daily_loss": "5%", "profit_split": "85%", "steps": 1, "duration": "30 days", "re_entry": "allowed"}', 'active'),

('vantage-pro', 'Vantage Pro', 'prop_firm', ARRAY['forex'], 'https://via.placeholder.com/200?text=Vantage', 'AU', ARRAY['IN', 'AU', 'SG', 'NZ'], ARRAY['MT4', 'MT5'], 100000, 5, 3.9, 124, 'https://vantagepro.com', 'https://vantagepro.com/ref/anuraj', false, true, 'Australia-based with ASIC regulation. Popular with Australian and Asian traders.',
'{"profit_target": "10%", "max_drawdown": "5%", "daily_loss": "3%", "profit_split": "75%", "steps": 1, "duration": "45 days", "re_entry": "allowed"}', 'active');

-- Insert Sample Brokers (India-focused)
INSERT INTO firms (slug, name, type, category, logo_url, country, countries_allowed, platforms, max_allocation, rating, review_count, website_url, affiliate_url, is_featured, is_verified, description, rules, status) VALUES

('zerodha', 'Zerodha', 'broker', ARRAY['forex', 'stocks', 'futures'], 'https://via.placeholder.com/200?text=Zerodha', 'IN', ARRAY['IN'], ARRAY['web', 'mobile', 'API'], 1000000, 4.8, 5420, 'https://zerodha.com', 'https://zerodha.com', true, true, 'India''s largest stock broker with excellent execution and lowest commissions. Perfect for Indian traders.',
'{"spreads": "0.5-2 pips", "leverage": "1:20", "deposit_min": "₹10,000", "regulation": "SEBI", "settlement": "T+1"}', 'active'),

('angel-one', 'Angel One', 'broker', ARRAY['stocks', 'futures', 'options'], 'https://via.placeholder.com/200?text=AngelOne', 'IN', ARRAY['IN'], ARRAY['web', 'mobile'], 500000, 4.5, 3200, 'https://angelone.in', 'https://angelone.in', true, true, 'Premium broker with advanced tools and derivative trading. Great for Indian traders.',
'{"spreads": "1-3 pips", "leverage": "1:20", "deposit_min": "₹5,000", "regulation": "SEBI", "settlement": "T+1"}', 'active'),

('shoonya', 'Shoonya by FTMO', 'broker', ARRAY['futures', 'forex'], 'https://via.placeholder.com/200?text=Shoonya', 'IN', ARRAY['IN', 'US', 'EU'], ARRAY['web', 'mobile', 'API'], 2000000, 4.6, 2100, 'https://shoonya.com', 'https://shoonya.com', false, true, 'Zero-commission broker by FTMO. Ideal for futures and forex traders in India.',
'{"spreads": "0 commission", "leverage": "1:20", "deposit_min": "₹1,000", "regulation": "SEBI", "settlement": "T+1"}', 'active'),

('upstox', 'Upstox', 'broker', ARRAY['stocks', 'futures'], 'https://via.placeholder.com/200?text=Upstox', 'IN', ARRAY['IN'], ARRAY['web', 'mobile', 'API'], 500000, 4.4, 2800, 'https://upstox.com', 'https://upstox.com', false, true, 'Fast-growing Indian broker with competitive spreads and good platform stability.',
'{"spreads": "0.5-2 pips", "leverage": "1:20", "deposit_min": "₹1,000", "regulation": "SEBI", "settlement": "T+1"}', 'active'),

('icici-direct', 'ICICI Direct', 'broker', ARRAY['stocks', 'futures', 'forex'], 'https://via.placeholder.com/200?text=ICICIDirect', 'IN', ARRAY['IN'], ARRAY['web', 'mobile'], 1000000, 4.3, 1900, 'https://icicidirect.com', 'https://icicidirect.com', false, true, 'Established bank-backed broker with strong research and institutional support.',
'{"spreads": "1-3 pips", "leverage": "1:20", "deposit_min": "₹5,000", "regulation": "SEBI", "settlement": "T+1"}', 'active'),

('motilal-oswal', 'Motilal Oswal', 'broker', ARRAY['stocks', 'futures', 'options'], 'https://via.placeholder.com/200?text=MotilalOswal', 'IN', ARRAY['IN'], ARRAY['web', 'mobile', 'API'], 500000, 4.2, 1500, 'https://motilaloswal.com', 'https://motilaloswal.com', false, true, 'Diversified brokerage with excellent research and derivative tools.',
'{"spreads": "1-2 pips", "leverage": "1:20", "deposit_min": "₹1,000", "regulation": "SEBI", "settlement": "T+1"}', 'active'),

('fyers', 'Fyers', 'broker', ARRAY['stocks', 'futures'], 'https://via.placeholder.com/200?text=Fyers', 'IN', ARRAY['IN'], ARRAY['web', 'mobile', 'API'], 300000, 4.1, 980, 'https://fyers.in', 'https://fyers.in', false, true, 'Modern broker with zero-commission trading and advanced charting tools.',
'{"spreads": "0 commission", "leverage": "1:20", "deposit_min": "₹500", "regulation": "SEBI", "settlement": "T+1"}', 'active');

-- Insert Sample Deals
INSERT INTO deals (firm_id, code, title, discount_label, description, is_featured, starts_at, expires_at, status) VALUES

((SELECT id FROM firms WHERE slug = 'ftmo'), 'AFX-FTMO25', 'FTMO Challenge 25% Off', '25% OFF', 'Get 25% discount on FTMO challenges this month. Use code AFX-FTMO25 at checkout.', true, NOW(), NOW() + INTERVAL '30 days', 'active'),

((SELECT id FROM firms WHERE slug = 'topstep'), 'ANURAJ-TOPSTEP', 'TopStep Verified Traders', '20% OFF', 'Exclusive 20% discount for verified traders. Limited time offer.', true, NOW(), NOW() + INTERVAL '15 days', 'active'),

((SELECT id FROM firms WHERE slug = '5ers'), 'AFX5ERS50', '5ers Fast Track', 'FREE', 'Fast track evaluation - skip one step with this code. First 50 users.', true, NOW(), NOW() + INTERVAL '7 days', 'active'),

((SELECT id FROM firms WHERE slug = 'traders-trust'), 'ANURAJ-TT', 'Traders Trust Starter', '30% OFF', 'New trader special: 30% off on starter packages.', false, NOW(), NOW() + INTERVAL '20 days', 'active'),

((SELECT id FROM firms WHERE slug = 'axismarkets'), 'AXIS-INDIA30', 'Axis Markets India Special', '30% OFF', 'India-exclusive offer: 30% discount on all packages.', false, NOW(), NOW() + INTERVAL '25 days', 'active'),

((SELECT id FROM firms WHERE slug = 'fundedtrader'), 'FT-VIP', 'Funded Trader VIP Access', '15% OFF', 'Get VIP support and 15% discount on evaluation fees.', false, NOW(), NOW() + INTERVAL '45 days', 'active'),

((SELECT id FROM firms WHERE slug = 'luxcapital', 'LUX-CRYPTO50', 'LUX Crypto Bundle', 'BONUS', 'Get 50% bonus on crypto trading. No code needed this week.', false, NOW(), NOW() + INTERVAL '10 days', 'active'),

((SELECT id FROM firms WHERE slug = 'zerodha'), 'ANURAJ-ZR', 'Zerodha Referral', 'BONUS', 'Sign up via our link and get ₹500 bonus. No code needed.', false, NOW(), NOW() + INTERVAL '90 days', 'active');

-- Insert Sample Reviews
INSERT INTO reviews (firm_id, user_id, rating, title, body, is_verified_trader, status) VALUES

((SELECT id FROM firms WHERE slug = 'ftmo'), 
 (SELECT id FROM profiles LIMIT 1), 
 5, 'Best prop firm!', 'FTMO is transparent and pays on time. Great rules and community support. Highly recommended for serious traders.', true, 'published'),

((SELECT id FROM firms WHERE slug = 'ftmo'),
 (SELECT id FROM profiles OFFSET 1 LIMIT 1),
 4, 'Good but expensive',
 'Rules are fair and payouts are reliable, but challenge costs are high compared to competitors.',
 false, 'published'),

((SELECT id FROM firms WHERE slug = 'topstep'),
 (SELECT id FROM profiles OFFSET 2 LIMIT 1),
 5, 'Excellent customer support',
 'TopStep team responds quickly to questions. The trading platform is stable. Worth every penny.',
 true, 'published'),

((SELECT id FROM firms WHERE slug = '5ers'),
 (SELECT id FROM profiles OFFSET 3 LIMIT 1),
 4, 'Solid choice for futures',
 '5ers is great if you trade futures. Crypto access is a bonus. Payouts take 3-5 days.',
 true, 'published'),

((SELECT id FROM firms WHERE slug = 'traders-trust'),
 (SELECT id FROM profiles OFFSET 4 LIMIT 1),
 3, 'Decent but basic',
 'Good entry-level firm but lacking advanced features. Rules are reasonable.',
 false, 'pending'),

((SELECT id FROM firms WHERE slug = 'axismarkets'),
 (SELECT id FROM profiles OFFSET 5 LIMIT 1),
 4, 'Perfect for Indian traders',
 'Support in Hindi/English is great. Low latency servers in Asia. Highly responsive team.',
 true, 'published');

-- Insert Sample Blog Posts
INSERT INTO blog_posts (slug, title, cover_image_url, excerpt, content_md, author_id, published, published_at) VALUES

('best-prop-firms-2024', 'Best Prop Firms in 2024: Complete Guide',
 'https://via.placeholder.com/800x400?text=Prop+Firms',
 'Discover the top prop firms for forex and futures trading in 2024. Compare features, rules, and payouts.',
 '# Best Prop Firms in 2024

Prop trading has exploded in popularity. Here are the top firms that traders should consider.

## FTMO
FTMO remains the gold standard with 80% profit splits and transparent operations.

## TopStep Trader
Great for US-based traders with NinjaTrader support and solid community.

## 5ers
Best for crypto traders looking to trade multiple asset classes.',
 (SELECT id FROM profiles LIMIT 1), true, NOW() - INTERVAL '5 days'),

('forex-trading-rules-explained', 'Understanding Prop Firm Trading Rules',
 'https://via.placeholder.com/800x400?text=Trading+Rules',
 'A deep dive into profit targets, drawdowns, and other rules that prop firms use.',
 '# Understanding Prop Firm Trading Rules

Prop firm rules can be confusing. Let''s break down the key terms:

## Profit Target
This is your goal. Usually 5-15% of the account.

## Max Drawdown
The maximum loss you can take. Once hit, you''re out.

## Daily Loss Limit
Protects the firm and keeps traders disciplined.',
 (SELECT id FROM profiles OFFSET 1 LIMIT 1), true, NOW() - INTERVAL '10 days'),

('india-trader-guide', 'Complete Guide for Indian Traders',
 'https://via.placeholder.com/800x400?text=India+Trading',
 'Everything Indian traders need to know about getting funded and trading internationally.',
 '# Complete Guide for Indian Traders

Trading internationally as an Indian trader? Here''s what you need to know:

## Tax Implications
Consult a CA about declaring foreign income.

## Best Brokers for Indians
Zerodha for stocks, but international brokers for prop trading.

## Payment Methods
Most firms accept international transfers via Wise or similar.',
 (SELECT id FROM profiles OFFSET 2 LIMIT 1), true, NOW() - INTERVAL '15 days');

-- Update market ticker data
INSERT INTO market_ticker (symbol, price, change_pct, sparkline, updated_at) VALUES
('XAUUSD', 2418.62, 0.45, ARRAY[2410.5, 2412.3, 2415.1, 2413.8, 2416.2, 2418.62], NOW()),
('NQ', 18450.75, 1.23, ARRAY[18200.0, 18250.0, 18350.0, 18400.0, 18425.0, 18450.75], NOW()),
('ES', 5725.50, 0.87, ARRAY[5680.0, 5695.0, 5710.0, 5715.0, 5720.0, 5725.50], NOW())
ON CONFLICT (symbol) DO UPDATE SET price = EXCLUDED.price, change_pct = EXCLUDED.change_pct, sparkline = EXCLUDED.sparkline, updated_at = NOW();
