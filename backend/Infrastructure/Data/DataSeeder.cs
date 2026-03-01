using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

/// <summary>
/// Seeds the database with realistic demo data on first run.
/// Skips silently if categories already exist (idempotent).
/// Default admin credentials: admin@cafe.com / Admin123!
/// </summary>
public static class DataSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.Categories.AnyAsync()) return;

        // ── Categories ───────────────────────────────────────────────
        var hotDrinks  = new Category { Id = Guid.NewGuid(), NameEn = "Hot Drinks",       NameAr = "المشروبات الساخنة",   DisplayOrder = 1, IsActive = true };
        var coldDrinks = new Category { Id = Guid.NewGuid(), NameEn = "Cold Drinks",      NameAr = "المشروبات الباردة",   DisplayOrder = 2, IsActive = true };
        var pastries   = new Category { Id = Guid.NewGuid(), NameEn = "Pastries & Cakes", NameAr = "المعجنات والكيك",     DisplayOrder = 3, IsActive = true };
        var breakfast  = new Category { Id = Guid.NewGuid(), NameEn = "Breakfast",        NameAr = "الإفطار",             DisplayOrder = 4, IsActive = true };
        var specials   = new Category { Id = Guid.NewGuid(), NameEn = "Specials",         NameAr = "عروض خاصة",           DisplayOrder = 5, IsActive = true };

        db.Categories.AddRange(hotDrinks, coldDrinks, pastries, breakfast, specials);

        // ── Menu Items ───────────────────────────────────────────────
        var now = DateTime.UtcNow;
        const string coffee1  = "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80";
        const string coffee2  = "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80";
        const string pastry1  = "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80";
        const string pastry2  = "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600&q=80";
        const string drink1   = "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&q=80";

        var menuItems = new List<MenuItem>
        {
            // Hot Drinks
            new() { Id = Guid.NewGuid(), CategoryId = hotDrinks.Id,  NameEn = "Espresso",           NameAr = "إسبريسو",              DescriptionEn = "A bold and concentrated shot of pure espresso, crafted with freshly ground Arabica beans.",          DescriptionAr = "جرعة إسبريسو قوية ومركّزة مصنوعة من حبوب أرابيكا مطحونة طازجاً.",                Price = 2.50m, ImageUrl = coffee1, IsFeatured = false, IsAvailable = true, DisplayOrder = 1, CreatedAt = now, UpdatedAt = now },
            new() { Id = Guid.NewGuid(), CategoryId = hotDrinks.Id,  NameEn = "Cappuccino",         NameAr = "كابتشينو",             DescriptionEn = "Velvety steamed milk layered over a rich espresso base, topped with a thick foam crown.",            DescriptionAr = "حليب مبخّر ناعم فوق قاعدة إسبريسو غنية، مغطى بطبقة رغوة كثيفة.",                  Price = 3.50m, ImageUrl = coffee2, IsFeatured = true,  IsAvailable = true, DisplayOrder = 2, CreatedAt = now, UpdatedAt = now },
            new() { Id = Guid.NewGuid(), CategoryId = hotDrinks.Id,  NameEn = "Café Latte",         NameAr = "كافيه لاتيه",          DescriptionEn = "Smooth and creamy with a delicate espresso flavour balanced by silky steamed whole milk.",           DescriptionAr = "ناعم وكريمي بنكهة إسبريسو لطيفة متوازنة مع حليب كامل الدسم مبخّر.",                Price = 3.80m, ImageUrl = coffee1, IsFeatured = false, IsAvailable = true, DisplayOrder = 3, CreatedAt = now, UpdatedAt = now },
            new() { Id = Guid.NewGuid(), CategoryId = hotDrinks.Id,  NameEn = "French Press",       NameAr = "فرنش برس",             DescriptionEn = "Full-bodied, rich coffee brewed by hand in a classic press — bold flavour, no bitterness.",           DescriptionAr = "قهوة غنية ذات جسم كامل مُعدّة يدوياً في برّاد كلاسيكي — نكهة جريئة بلا مرارة.",    Price = 4.00m, ImageUrl = coffee2, IsFeatured = false, IsAvailable = true, DisplayOrder = 4, CreatedAt = now, UpdatedAt = now },
            new() { Id = Guid.NewGuid(), CategoryId = hotDrinks.Id,  NameEn = "Matcha Latte",       NameAr = "ماتشا لاتيه",          DescriptionEn = "Ceremonial-grade Japanese matcha whisked with oat milk for a smooth, earthy, and vibrant cup.",     DescriptionAr = "ماتشا يابانية فاخرة مخفوقة مع حليب الشوفان للحصول على كوب ناعم ومميز.",             Price = 4.50m, ImageUrl = drink1,  IsFeatured = true,  IsAvailable = true, DisplayOrder = 5, CreatedAt = now, UpdatedAt = now },

            // Cold Drinks
            new() { Id = Guid.NewGuid(), CategoryId = coldDrinks.Id, NameEn = "Iced Latte",         NameAr = "لاتيه بارد",           DescriptionEn = "Double espresso poured over ice and cold milk — refreshing with a smooth coffee kick.",              DescriptionAr = "إسبريسو مزدوج فوق الثلج والحليب البارد — منعش مع نبضة قهوة ناعمة.",                Price = 4.00m, ImageUrl = drink1,  IsFeatured = true,  IsAvailable = true, DisplayOrder = 1, CreatedAt = now, UpdatedAt = now },
            new() { Id = Guid.NewGuid(), CategoryId = coldDrinks.Id, NameEn = "Fresh Lemonade",     NameAr = "ليمون طازج",           DescriptionEn = "Squeezed lemons, mint leaves, and a hint of sugar over crushed ice. The perfect refresher.",         DescriptionAr = "ليمون معصور وأوراق نعناع وقليل من السكر فوق الثلج المجروش. المنعش المثالي.",        Price = 3.00m, ImageUrl = drink1,  IsFeatured = false, IsAvailable = true, DisplayOrder = 2, CreatedAt = now, UpdatedAt = now },
            new() { Id = Guid.NewGuid(), CategoryId = coldDrinks.Id, NameEn = "Cold Brew",          NameAr = "كولد برو",             DescriptionEn = "12-hour cold-steeped coffee concentrate, smooth, low-acidity, served over ice.",                    DescriptionAr = "تركيز قهوة منقوعة على البارد 12 ساعة، ناعمة وذات حموضة منخفضة، تُقدَّم فوق الثلج.", Price = 4.50m, ImageUrl = coffee1, IsFeatured = false, IsAvailable = true, DisplayOrder = 3, CreatedAt = now, UpdatedAt = now },

            // Pastries & Cakes
            new() { Id = Guid.NewGuid(), CategoryId = pastries.Id,   NameEn = "Butter Croissant",   NameAr = "كرواسان بالزبدة",      DescriptionEn = "Flaky, golden croissant baked fresh daily with premium French butter. Served warm.",                 DescriptionAr = "كرواسان ذهبي هش مخبوز طازجاً يومياً بزبدة فرنسية ممتازة. يُقدَّم دافئاً.",          Price = 2.80m, ImageUrl = pastry1, IsFeatured = false, IsAvailable = true, DisplayOrder = 1, CreatedAt = now, UpdatedAt = now },
            new() { Id = Guid.NewGuid(), CategoryId = pastries.Id,   NameEn = "Chocolate Fondant",  NameAr = "فوندان الشوكولاتة",    DescriptionEn = "Warm dark-chocolate cake with a liquid centre, dusted with cocoa and served with vanilla cream.",   DescriptionAr = "كيك شوكولاتة داكنة دافئة بمركز سائل، مع مسحوق الكاكاو وكريمة الفانيليا.",           Price = 5.50m, ImageUrl = pastry2, IsFeatured = true,  IsAvailable = true, DisplayOrder = 2, CreatedAt = now, UpdatedAt = now },
            new() { Id = Guid.NewGuid(), CategoryId = pastries.Id,   NameEn = "Almond Tart",        NameAr = "تارت اللوز",           DescriptionEn = "Crisp pastry shell filled with a rich almond frangipane and topped with toasted almond flakes.",    DescriptionAr = "قاعدة معجنات مقرمشة محشوة بفرنجيبان اللوز الغني ومزيّنة برقائق اللوز المحمّصة.",   Price = 4.50m, ImageUrl = pastry1, IsFeatured = false, IsAvailable = true, DisplayOrder = 3, CreatedAt = now, UpdatedAt = now },
            new() { Id = Guid.NewGuid(), CategoryId = pastries.Id,   NameEn = "Cinnamon Roll",      NameAr = "سيناموم رول",          DescriptionEn = "Soft, pillowy dough swirled with cinnamon sugar and finished with a cream cheese glaze.",          DescriptionAr = "عجينة طرية ملفوفة بالقرفة والسكر ومغطاة بصقيل جبنة الكريمة.",                       Price = 3.50m, ImageUrl = pastry2, IsFeatured = false, IsAvailable = true, DisplayOrder = 4, CreatedAt = now, UpdatedAt = now },

            // Breakfast
            new() { Id = Guid.NewGuid(), CategoryId = breakfast.Id,  NameEn = "Avocado Toast",      NameAr = "توست الأفوكادو",       DescriptionEn = "Sourdough toast topped with smashed avocado, cherry tomatoes, poached egg, and chilli flakes.",    DescriptionAr = "توست العجين المخمّر مع أفوكادو مهروس وطماطم كرز وبيض مسلوق ورقائق فلفل حار.",      Price = 8.50m, ImageUrl = coffee1, IsFeatured = true,  IsAvailable = true, DisplayOrder = 1, CreatedAt = now, UpdatedAt = now },
            new() { Id = Guid.NewGuid(), CategoryId = breakfast.Id,  NameEn = "Eggs Benedict",      NameAr = "بيض بنيديكت",          DescriptionEn = "Poached eggs on a toasted English muffin with ham and house-made hollandaise sauce.",               DescriptionAr = "بيض مسلوق على خبز إنجليزي محمّص مع لحم وصلصة هولنديز محلية الصنع.",                 Price = 9.00m, ImageUrl = coffee2, IsFeatured = false, IsAvailable = true, DisplayOrder = 2, CreatedAt = now, UpdatedAt = now },
            new() { Id = Guid.NewGuid(), CategoryId = breakfast.Id,  NameEn = "Granola Bowl",       NameAr = "بول الجرانولا",        DescriptionEn = "House granola with Greek yogurt, seasonal berries, honey drizzle, and toasted coconut shavings.",  DescriptionAr = "جرانولا منزلية مع زبادي يوناني وتوت موسمي وعسل ورقائق جوز الهند المحمّص.",           Price = 7.00m, ImageUrl = pastry1, IsFeatured = false, IsAvailable = true, DisplayOrder = 3, CreatedAt = now, UpdatedAt = now },

            // Specials
            new() { Id = Guid.NewGuid(), CategoryId = specials.Id,   NameEn = "Chef's Brunch Plate",  NameAr = "طبق الشيف للبرنش",   DescriptionEn = "A curated selection of the day's freshest items — ask your server for today's composition.",       DescriptionAr = "تشكيلة مختارة من أطازج مقدمات اليوم — اسأل النادل عن تشكيلة اليوم.",               Price = 13.00m, ImageUrl = pastry2, IsFeatured = true,  IsAvailable = true, DisplayOrder = 1, CreatedAt = now, UpdatedAt = now },
            new() { Id = Guid.NewGuid(), CategoryId = specials.Id,   NameEn = "Signature Blend Coffee", NameAr = "قهوة المزيج الخاص", DescriptionEn = "Our exclusive in-house roast — a balanced blend of Ethiopian and Colombian beans, served your way.", DescriptionAr = "تحميصنا الخاص — مزيج متوازن من حبوب إثيوبية وكولومبية، يُقدَّم بالطريقة التي تفضّلها.", Price = 5.50m, ImageUrl = coffee1, IsFeatured = true,  IsAvailable = true, DisplayOrder = 2, CreatedAt = now, UpdatedAt = now },
        };

        db.MenuItems.AddRange(menuItems);

        // ── Reservations ─────────────────────────────────────────────
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var reservations = new List<Reservation>
        {
            new() { Id = Guid.NewGuid(), CustomerName = "Ahmed Al-Rashid",   Phone = "+216 55 123 456", Email = "ahmed@example.com",    Date = today.AddDays(-5), Time = new TimeOnly(19, 0),  PartySize = 4, Status = ReservationStatus.Completed,  SpecialRequests = "Window table preferred", WhatsAppNotified = true,  CreatedAt = now.AddDays(-6) },
            new() { Id = Guid.NewGuid(), CustomerName = "Sophie Martin",     Phone = "+33 6 12 34 56 78", Email = "sophie@example.com", Date = today.AddDays(-3), Time = new TimeOnly(12, 30), PartySize = 2, Status = ReservationStatus.Completed,  SpecialRequests = null,                     WhatsAppNotified = true,  CreatedAt = now.AddDays(-4) },
            new() { Id = Guid.NewGuid(), CustomerName = "Khalid Ben Salem",  Phone = "+216 98 765 432", Email = null,                   Date = today.AddDays(-1), Time = new TimeOnly(20, 0),  PartySize = 6, Status = ReservationStatus.Confirmed,   SpecialRequests = "Birthday dinner, please prepare a surprise", WhatsAppNotified = true, CreatedAt = now.AddDays(-2) },
            new() { Id = Guid.NewGuid(), CustomerName = "Lena Müller",       Phone = "+49 151 23456789", Email = "lena@example.com",   Date = today,             Time = new TimeOnly(13, 0),  PartySize = 3, Status = ReservationStatus.Confirmed,   SpecialRequests = "One vegetarian guest",   WhatsAppNotified = false, CreatedAt = now.AddDays(-1) },
            new() { Id = Guid.NewGuid(), CustomerName = "Marco Rossi",       Phone = "+39 347 1234567",  Email = "marco@example.com",  Date = today,             Time = new TimeOnly(19, 30), PartySize = 2, Status = ReservationStatus.Pending,     SpecialRequests = null,                     WhatsAppNotified = false, CreatedAt = now.AddHours(-3) },
            new() { Id = Guid.NewGuid(), CustomerName = "Yasmine Karoui",    Phone = "+216 22 334 455", Email = "yasmine@example.com",  Date = today.AddDays(1),  Time = new TimeOnly(12, 0),  PartySize = 5, Status = ReservationStatus.Pending,     SpecialRequests = "High chair needed for toddler", WhatsAppNotified = false, CreatedAt = now.AddHours(-2) },
            new() { Id = Guid.NewGuid(), CustomerName = "James O'Brien",     Phone = "+353 87 123 4567", Email = "james@example.com",  Date = today.AddDays(2),  Time = new TimeOnly(18, 30), PartySize = 4, Status = ReservationStatus.Pending,     SpecialRequests = null,                     WhatsAppNotified = false, CreatedAt = now.AddHours(-1) },
            new() { Id = Guid.NewGuid(), CustomerName = "Nour Haddad",       Phone = "+216 71 456 789", Email = null,                   Date = today.AddDays(-2), Time = new TimeOnly(14, 0),  PartySize = 2, Status = ReservationStatus.Cancelled,   SpecialRequests = "Allergic to nuts",       WhatsAppNotified = false, CreatedAt = now.AddDays(-3) },
            new() { Id = Guid.NewGuid(), CustomerName = "Clara Fontaine",    Phone = "+32 477 12 34 56", Email = "clara@example.com",  Date = today.AddDays(3),  Time = new TimeOnly(20, 30), PartySize = 8, Status = ReservationStatus.Confirmed,   SpecialRequests = "Corporate dinner, quiet area please", WhatsAppNotified = true, CreatedAt = now.AddHours(-5) },
            new() { Id = Guid.NewGuid(), CustomerName = "Samir Trabelsi",    Phone = "+216 50 987 654", Email = "samir@example.com",    Date = today.AddDays(1),  Time = new TimeOnly(21, 0),  PartySize = 2, Status = ReservationStatus.Pending,     SpecialRequests = "Anniversary dinner",     WhatsAppNotified = false, CreatedAt = now.AddMinutes(-30) },
        };

        db.Reservations.AddRange(reservations);

        // ── Contact Messages ─────────────────────────────────────────
        var messages = new List<ContactMessage>
        {
            new() { Id = Guid.NewGuid(), Name = "Sophie Martin",    Email = "sophie@example.com",  Subject = "Private event inquiry",        Message = "Hello, I would like to inquire about hosting a private birthday dinner for 20 guests at your café. Could you share availability and pricing for the last weekend of March? Thank you.",                                                                         IsRead = true,  CreatedAt = now.AddDays(-7) },
            new() { Id = Guid.NewGuid(), Name = "Khalid Ben Salem", Email = "khalid@example.com",  Subject = "Gluten-free options",          Message = "Hi there! I have a severe gluten intolerance and wanted to ask if you have certified gluten-free items on the menu. I'm planning to visit with friends next week and would love to know what I can safely enjoy.",                              IsRead = true,  CreatedAt = now.AddDays(-4) },
            new() { Id = Guid.NewGuid(), Name = "Amina Chaouachi",  Email = "amina@example.com",   Subject = "Compliment — amazing coffee!", Message = "Just wanted to say your Signature Blend Coffee is the best I've had in the city. My husband and I visited on Saturday and we'll definitely be regulars. The ambiance is wonderful too. Keep up the great work!",                               IsRead = true,  CreatedAt = now.AddDays(-2) },
            new() { Id = Guid.NewGuid(), Name = "James O'Brien",    Email = "james@example.com",   Subject = "Catering inquiry",             Message = "We're organising a corporate team breakfast for about 15 people and were wondering if Café Lumière offers catering or delivery services. Please get back to me at your earliest convenience.",                                                         IsRead = false, CreatedAt = now.AddDays(-1) },
            new() { Id = Guid.NewGuid(), Name = "Lena Müller",      Email = "lena@example.com",    Subject = "Feedback on reservation form", Message = "I tried to book a table for 7 people but the form only goes up to 6 guests. Is there a way to request larger party sizes? We would love to celebrate a friend's promotion with your lovely team.",                                         IsRead = false, CreatedAt = now.AddHours(-5) },
            new() { Id = Guid.NewGuid(), Name = "Youssef Gharbi",   Email = "youssef@example.com", Subject = "Loyalty programme question",   Message = "Do you have any loyalty cards or a points programme for regulars? I come in almost every morning and would love to know if there's a way to earn rewards. Thanks in advance!",                                                                    IsRead = false, CreatedAt = now.AddHours(-1) },
        };

        db.ContactMessages.AddRange(messages);

        // ── Admin User ───────────────────────────────────────────────
        // Default credentials: admin@cafe.com / Admin123!
        var admin = new User
        {
            Id           = Guid.NewGuid(),
            FullName     = "Café Admin",
            Email        = "admin@cafe.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Role         = UserRole.Admin,
            CreatedAt    = now,
        };

        db.Users.Add(admin);

        await db.SaveChangesAsync();
    }
}
