insert into restaurants (id, name, logo_url, description_en, description_ar, phone, whatsapp, email, address_en, address_ar, google_maps_url, currency)
values (
  '00000000-0000-0000-0000-000000000001',
  'Smoke & Fire',
  '/logo.png',
  'Premium burgers and BBQ crafted with fire and smoke. Every bite is a bold experience.',
  'برجر وباربكيو فاخر مصنوع بالنار والدخان. كل قضمة تجربة جريئة.',
  '+966 50 000 0000',
  '+966 50 000 0000',
  'info@smokeandfire.sa',
  'King Fahd Road, Riyadh',
  'طريق الملك فهد، الرياض',
  'https://maps.google.com/?q=Smoke+and+Fire+Riyadh',
  'SAR'
);

insert into categories (restaurant_id, name_en, name_ar, slug, sort_order) values
  ('00000000-0000-0000-0000-000000000001', 'Burgers', 'برجر', 'burgers', 1),
  ('00000000-0000-0000-0000-000000000001', 'Meals', 'وجبات', 'meals', 2),
  ('00000000-0000-0000-0000-000000000001', 'Chicken', 'دجاج', 'chicken', 3),
  ('00000000-0000-0000-0000-000000000001', 'Sides', 'مقبلات', 'sides', 4),
  ('00000000-0000-0000-0000-000000000001', 'Sauces', 'صلصات', 'sauces', 5),
  ('00000000-0000-0000-0000-000000000001', 'Drinks', 'مشروبات', 'drinks', 6),
  ('00000000-0000-0000-0000-000000000001', 'Desserts', 'حلويات', 'desserts', 7);

do $$
declare
  v_rid uuid := '00000000-0000-0000-0000-000000000001';
  v_burgers uuid; v_meals uuid; v_chicken uuid; v_sides uuid; v_sauces uuid; v_drinks uuid; v_desserts uuid;
begin
  select id into v_burgers from categories where restaurant_id = v_rid and slug = 'burgers';
  select id into v_meals from categories where restaurant_id = v_rid and slug = 'meals';
  select id into v_chicken from categories where restaurant_id = v_rid and slug = 'chicken';
  select id into v_sides from categories where restaurant_id = v_rid and slug = 'sides';
  select id into v_sauces from categories where restaurant_id = v_rid and slug = 'sauces';
  select id into v_drinks from categories where restaurant_id = v_rid and slug = 'drinks';
  select id into v_desserts from categories where restaurant_id = v_rid and slug = 'desserts';

  insert into menu_items (category_id, restaurant_id, name_en, name_ar, description_en, description_ar, price, is_popular, sort_order) values
    (v_burgers, v_rid, 'Smokehouse Burger', 'برجر سموك هاوس', 'Double smashed patties, smoked cheddar, caramelized onions, house sauce', 'قطعتين لحم، جبنة شيدر مدخنة، بصل مكرمل، صوص المنزل', 42, true, 1),
    (v_burgers, v_rid, 'Flame Griller', 'برجر فليم جريلر', 'Single thick patty, flame-grilled, pepper jack, jalapeños', 'قطعة لحم سميكة مشوية، جبنة بيبر جاك، هالبينو', 38, true, 2),
    (v_burgers, v_rid, 'BBQ Bacon Beast', 'برجر باربكيو بيكون', 'Beef patty, bacon strips, BBQ sauce, onion rings', 'قطعة لحم بقري، شرائح بايكون، صوص باربيكيو، حلقات البصل', 45, false, 3);

  insert into menu_items (category_id, restaurant_id, name_en, name_ar, description_en, description_ar, price, is_spicy, sort_order) values
    (v_burgers, v_rid, 'Spicy Inferno', 'برجر انفيرنو الحار', 'Fire-grilled patty, ghost pepper cheese, habanero sauce', 'قطعة لحم مشوية، جبنة الفلفل الحار، صوص هابانيرو', 40, true, 4);

  insert into menu_items (category_id, restaurant_id, name_en, name_ar, description_en, description_ar, price, is_popular, sort_order) values
    (v_chicken, v_rid, 'Smoky Chicken Sandwich', 'ساندويتش دجاج مدخن', 'Grilled chicken breast, smoked mayo, lettuce, tomato', 'صدر دجاج مشوي، مايونيز مدخن، خس، طماطم', 35, true, 1),
    (v_chicken, v_rid, 'Buffalo Fire Wrap', 'وافل بافلو فاير', 'Crispy chicken, buffalo sauce, ranch, tortilla wrap', 'دجاج مقرمش، صوص بافلو، رانش، تورتيلا', 32, false, 2);

  insert into menu_items (category_id, restaurant_id, name_en, name_ar, description_en, description_ar, price, is_popular, sort_order) values
    (v_sides, v_rid, 'Loaded Fries', 'فرايز محملة', 'Crispy fries, cheese sauce, bacon bits, green onions', 'بطاطس مقلية، صوص الجبنة، قطع بايكون، بصل أخضر', 22, true, 1),
    (v_sides, v_rid, 'Onion Rings', 'حلقات البصل', 'Beer-battered onion rings, smoky dipping sauce', 'حلقات بصل مقلية، صوص مدخن للتغميس', 18, false, 2),
    (v_sides, v_rid, 'Coleslaw', 'كول سلو', 'Creamy house slaw with a smoky twist', 'سلطة ملفوف كريمية بنكهة مدخنة', 14, false, 3);

  insert into menu_items (category_id, restaurant_id, name_en, name_ar, description_en, description_ar, price, sort_order) values
    (v_sauces, v_rid, 'Smoky BBQ', 'باربيكيو مدخن', 'Rich, smoky barbecue sauce', 'صوص باربيكيو غني ومدخن', 5, 1),
    (v_sauces, v_rid, 'Fire Sauce', 'صوص النار', 'Spicy chili sauce with a kick', 'صوص الفلفل الحار القوي', 5, 2),
    (v_sauces, v_rid, 'Garlic Aioli', 'أيولي الثوم', 'Creamy roasted garlic aioli', 'أيولي ثوم محمص وكريمي', 5, 3);

  insert into menu_items (category_id, restaurant_id, name_en, name_ar, description_en, description_ar, price, sort_order) values
    (v_drinks, v_rid, 'House Lemonade', 'عصير ليمون المنزل', 'Fresh-squeezed lemonade with a hint of smoke', 'عصير ليمون طازج مع لمسة دخانية', 16, 1),
    (v_drinks, v_rid, 'Soft Drink', 'مشروب غازي', 'Selection of soft drinks', 'تشكيلة من المشروبات الغازية', 10, 2),
    (v_drinks, v_rid, 'Water', 'ماء', 'Bottled mineral water', 'مياه معدنية معبأة', 5, 3);

  insert into menu_items (category_id, restaurant_id, name_en, name_ar, description_en, description_ar, price, sort_order) values
    (v_desserts, v_rid, 'Smores Brownie', 'براوني سمورز', 'Warm chocolate brownie, toasted marshmallow, graham crumble', 'براوني شوكولاتة دافئ، مارشميلو محمص، فتات غراهام', 28, 1),
    (v_desserts, v_rid, 'Fire-Roasted Pineapple', 'أناناس مشوي', 'Caramelized pineapple, vanilla ice cream, chili honey', 'أناناس مكرمل، آيس كريم فانيلا، عسل الفلفل', 25, 2);

  insert into menu_items (category_id, restaurant_id, name_en, name_ar, description_en, description_ar, price, is_popular, sort_order) values
    (v_meals, v_rid, 'Smokehouse Combo', 'كومبو سموك هاوس', 'Smokehouse Burger + Loaded Fries + Drink', 'برجر سموك هاوس + فرايز محملة + مشروب', 65, true, 1),
    (v_meals, v_rid, 'Chicken Fire Combo', 'كومبو الدجاج الحار', 'Buffalo Fire Wrap + Fries + Drink', 'وافل بافلو فاير + بطاطس + مشروب', 52, false, 2);
end $$;

insert into restaurant_socials (restaurant_id, platform, url, is_enabled, sort_order) values
  ('00000000-0000-0000-0000-000000000001', 'instagram', 'https://instagram.com/smokeandfire', true, 1),
  ('00000000-0000-0000-0000-000000000001', 'whatsapp', 'https://wa.me/966500000000', true, 2),
  ('00000000-0000-0000-0000-000000000001', 'tiktok', 'https://tiktok.com/@smokeandfire', true, 3),
  ('00000000-0000-0000-0000-000000000001', 'phone', 'tel:+966500000000', true, 4);

insert into opening_hours (restaurant_id, day_of_week, open_time, close_time, is_closed) values
  ('00000000-0000-0000-0000-000000000001', 0, '13:00', '01:00', false),
  ('00000000-0000-0000-0000-000000000001', 1, '13:00', '01:00', false),
  ('00000000-0000-0000-0000-000000000001', 2, '13:00', '01:00', false),
  ('00000000-0000-0000-0000-000000000001', 3, '13:00', '01:00', false),
  ('00000000-0000-0000-0000-000000000001', 4, '13:00', '02:00', false),
  ('00000000-0000-0000-0000-000000000001', 5, '13:00', '02:00', false),
  ('00000000-0000-0000-0000-000000000001', 6, '13:00', '01:00', false);
