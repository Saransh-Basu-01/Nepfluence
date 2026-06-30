import enum
class InfluencerNiche(str, enum.Enum):
    TECH = "tech"
    GAMING = "gaming"
    EDUCATION = "education"
    FINANCE = "finance"
    FITNESS = "fitness"
    FOOD = "food"
    TRAVEL = "travel"
    ENTERTAINMENT = "entertainment"
    MUSIC = "music"
    BEAUTY = "beauty"
    BUSINESS = "business"
    LIFESTYLE = "lifestyle"
    SPORTS = "sports"
    NEWS = "news"
    AUTOMOTIVE = "automotive"
    OTHER = "other"

class SocialPlatform(str, enum.Enum):
    instagram = "instagram"
    youtube = "youtube"
    tiktok = "tiktok"