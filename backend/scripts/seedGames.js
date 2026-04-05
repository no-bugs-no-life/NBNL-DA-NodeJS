const mongoose = require("mongoose");
const appModel = require("../schemas/apps");
const categoryModel = require("../schemas/categories");
const userModel = require("../schemas/users");
const slugify = require("slugify");

const mockGamesData = [
    {
        name: "Cyber Odyssey",
        priceText: "$59.99",
        ratingScore: 4.8,
        iconUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCuVekkR9i2ZjPdGuSPvTTv8XDPUbpnNT7aXdR4J6Zd_VrNZUrrfDhPPp4jT4Cz8AuRAT8rJDFmeH2DhcP4jK06DeN14QZV8DzOBVwi4pygu8vM0tKcl55TqNK6vKuZKw01TWnLeO-sQ4b-sYFlKrIP8zbE1ZYJrlgejLyL09VmSKSn7kZ6pTsq5mHZ1eX8jXs9p3HbBfgtSTPCXTdm8qtx-ZFYPK-skoCUm1m-I9ebMt--UymayzZyJ6wbVL1UA9VP5_rMYBzbbD8",
        tags: ["GAME PASS"]
    },
    {
        name: "Ethereal Realm",
        priceText: "Miễn phí",
        ratingScore: 4.6,
        iconUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNKTdrQ6P4cMYKpL9rxfveN2jxSIcRLUhnFzcy6zlE-LZFHHMx6weB7q6GnWWwLr6E9NTtMPMTDOhvS316X5Bfc5750W6V8Gd08ZgNdf-xnbYSK-eYrDaAI0vbtSO1jiKdADoDsMRa_Lco2dsht7TgWrBQ3qaqx2mW6-l0rf_va6TQWTTTM0OQH21hTO6n8Hvac_GetYQVsWqQuZgFCOFwRyDV1AiOwSa4BnbrDJ6rn6wH9RDhpySrCr1uuWOHrJbPhw2Fue7Ehds"
    },
    {
        name: "Tactical Strike",
        priceText: "$29.99",
        ratingScore: 4.4,
        iconUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDn7YwC8z_9E-eTxc-2wHpCiiILXZwaiFKEOwn4KFCic6pWmMsathQFQFGtjNpH971k9S9hWI2kDx3utieM4oGLWz_POp3hlerxQ0XcdAMIT1YyWEDr8zfc2rmBHSbLRadVF-LsqTJCpIE0ZEqYZqDZCGEdjkgAFO3PrFi37bp4CFteDU-7OgDT0q84qQkL3obGo-dQvnUKnLDsIBFRDPD0x-E9RNEoINDrOqN-O7HmeiGZ8L5O9wR8xDS6s5NW0yswJMNNEfz6yo"
    },
    {
        name: "Velocity X",
        priceText: "$19.99",
        ratingScore: 4.7,
        iconUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1zYy0yUK2JHvV5rwfQ9h9rtaKvd6GebSYJlbO6wE062thHNhAzOuWpdfeJWRYh-Fe1v41z7w8xbVME_mw8fR4_Zpk1i6VubBKuziSELOO4Ga3NaMxm0uKfgoXdnLgv9biFbXULjMj0SM4yfohpDLg6oT5vFq0U15FxLAf2ypz4Kc4az4gfUo9H6mUJIDlOSsaf9XcvsaDF7MmYTR3NUy7BcRrlautVpzJLAjPVae7aCEmyX-rfgwSprstbpzGOYmN97_w7uyMsDc"
    },
    {
        name: "Wonder Woods",
        priceText: "$14.99",
        ratingScore: 4.9,
        iconUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJugrmz7eD_g9plkvzUAbrHSCv9UHjWVAE3gGtuJrcOulzLJxVpK25lAhrglRgGrCjFzdtgiXgNFgXqf7BiTcusp4DASVTkHbsWQzmqQ9iE7oRZUlnGYBJ1wtdHTaiWeo4HCC94mcPezQWKdja3ShgHC-r4ofHMDyGEG8g5sb_l_kDOkftoj9EgcvUhehTcg4Y6qiu8A3zzucKdbVB3MrQkSctfz_CCxmaKbclCv_ppzM22DEslj-0EAx_r3ZfOF9yjUIyQAGLQPg"
    },
    {
        name: "Gothic Legends",
        priceText: "Miễn phí",
        ratingScore: 4.5,
        iconUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZ6YazAQ-bc6xUh7NAYzTUVmA6j0EcuCr0wXLOsPd3PJST1pk-tL-yQa6Y_fjx36KpqgSqTVFFgMp--eOnNCGlTVmOjod9dFcNCKD_rKzL2umNjcgCJJAwT7Jd9bujyqAYOM9Dx5yrM6f0SFmiRQxDFDyRp8dwrl3cZ0FJg4tJxiWVECMPhpyF3w72uApmLWKUyN0qDi_doxEV6vyZMFHdZcstIddBzpj39kx1dFRL62M1syna1ENS-3JkpRnlEZ9OoDJYe72yR5c"
    },
    {
        name: "Stellar Frontiers",
        priceText: "$39.99",
        ratingScore: 4.2,
        iconUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvjgcGTThU-5hkonzGghyOtGc7x5MKa_AWqh-O42zfi2ol-cb5m1of9Bpu_WH_9aAIg2hXC7oVloI6jyEc7R_XGnkn6rRkPFxxThOMFFR1SU16NwM6Tr2nnfvFFNBAYBOIR0q2nM8dTArVJBU8QKalHEIxLO9yI9E3YYFdXF2_raBp4QaANIt1uIAhpIuC2Q-xVA97-GUauGmUrJlp0j7qtTZ2prSsV95DwGit3uTfCt2oFYQDsmfD3ufzrjhwAklWRXRac96VdGI"
    },
    {
        name: "Forza Drift",
        priceText: "$29.99",
        ratingScore: 4.8,
        iconUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDn-kgwJpwUToDuGIj9BfACQQ9Axe4DtmiywBpSNSwxZVhgE6wX0oINKJ9KhlYqZGhiFy4QleO8SEfmKNtrRteBtCQNCpr-N8SZ7L8Q-G_K16yy_NbITwBvYkgMHJzYt5fRKx2PZ1JF1Um_9ZQuoZEtDBRWRyxu-_WIPcj2WgQsSR07TdVQG3OijIyhuf3GdqJZzNAfOzu9eA1UHlkd75jlwm-cSqPChOMET_3m2avfRq4a_ZAWuoybClT61lmgUYbrBdd_9wZU1uY"
    }
];

const mockDetailData = {
    size: "45.2 GB",
    platforms: ["PC"],
    systemRequirements: {
        min: { os: "Windows 10 64-bit", cpu: "Intel Core i5-8400", ram: "8 GB RAM", graphics: "NVIDIA GTX 1060" },
        recommended: { os: "Windows 11", cpu: "Intel Core i7-10700K", ram: "16 GB RAM", graphics: "NVIDIA RTX 3070" }
    },
    features: [
        { icon: "sports_esports", desc: "Hỗ trợ tay cầm trọn vẹn" },
        { icon: "cloud_sync", desc: "Lưu trữ đám mây qua APKBugs Cloud" },
        { icon: "group", desc: "Chế độ nhiều người chơi trực tuyến" }
    ],
    languageSupportCount: 12,
    securityVerified: true,
    inAppPurchases: true,
};

async function seedGames() {
    try {
        console.log("Starting Games Seeding...");
        const devUser = await userModel.findOne({ username: "system_dev" });

        let gameCat = await categoryModel.findOne({ name: "Games" });
        if (!gameCat) {
            gameCat = await categoryModel.create({
                name: "Games",
                description: "Giải trí và Trò chơi",
                slug: "games"
            });
        }

        for (let game of mockGamesData) {
            const slug = slugify(game.name, { replacement: '-', lower: true, locale: 'vi', trim: true });

            let priceNum = 0;
            if (game.priceText && game.priceText.includes("$")) {
                priceNum = parseFloat(game.priceText.replace("$", ""));
            }

            const dynamicScreenshots = [
                `https://picsum.photos/seed/game-${slug}-1/800/450`,
                `https://picsum.photos/seed/game-${slug}-2/800/450`,
                `https://picsum.photos/seed/game-${slug}-3/800/450`
            ];

            const tags = game.tags ? [...game.tags, "Game"] : ["Game", "Giải trí"];

            await appModel.updateOne(
                { name: game.name },
                {
                    $set: {
                        name: game.name,
                        description: "Một tuyệt tác thể loại game giải trí đỉnh cao đến từ nhà phát triển hàng đầu.",
                        price: priceNum,
                        status: "published",
                        ...mockDetailData,
                        slug,
                        type: "game",
                        tags: tags,
                        iconUrl: game.iconUrl,
                        screenshots: dynamicScreenshots,
                        ratingScore: game.ratingScore,
                        ratingCount: Math.floor(Math.random() * 50000) + 1000,
                        developerId: devUser ? devUser._id : null,
                        categoryId: gameCat._id,
                        flags: ["bestseller"]
                    }
                },
                { upsert: true }
            );
        }
        console.log("✅ Games seeded successfully.");
    } catch (err) {
        console.error("❌ Error during Games seeding: ", err);
        throw err;
    }
}

module.exports = seedGames;
