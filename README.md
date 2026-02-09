# 💕 Valentine Surprise Website

เว็บไซต์สุดน่ารักสำหรับวันวาเลนไทน์ โทนสีขาว-ชมพู พร้อมลูกเล่นเยอะมากกก!

![Valentine](https://img.shields.io/badge/Valentine-Special-pink)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## ✨ ฟีเจอร์เด็ดๆ

| หน้า | ลูกเล่น |
|------|---------|
| **Welcome** | หัวใจเต้น + คลิกส่งจุ๊บ 💋 |
| **จดหมายรัก** | ข้อความหวานๆ ในการ์ด |
| **แกลเลอรี่** | 6 รูปความทรงจำ คลิกมี sparkle ✨ |
| **วิดีโอ** | วิดีโอรักพร้อม effects |
| **ควิซ** | คำถาม + Love Meter |
| **Surprise** | กล่องของขวัญ + พลุ + Confetti |

## 🎨 โทนสี
- **Primary:** `#ff6b9d` (ชมพู)
- **Secondary:** `#ff8fab` (ชมพูอ่อน)
- **Background:** Gradient ขาว-ชมพู

## 📁 โครงสร้าง Folder

```
valentine-surprise/
├── index.html          # หน้าหลัก
├── css/
│   └── style.css       # สไตล์ทั้งหมด
├── js/
│   └── main.js         # JavaScript ลูกเล่นต่างๆ
├── images/             # โฟลเดอร์รูปภาพ
│   ├── photo1.jpg
│   ├── photo2.jpg
│   ├── photo3.jpg
│   ├── photo4.jpg
│   ├── photo5.jpg
│   └── photo6.jpg
├── videos/             # โฟลเดอร์วิดีโอ
│   └── love-video.mp4
├── vercel.json         # Config สำหรับ Vercel
└── README.md           # ไฟล์นี้
```

## 🚀 วิธี Deploy ขึ้น Vercel

### วิธีที่ 1: ผ่าน Vercel CLI

```bash
# 1. ติดตั้ง Vercel CLI (ถ้ายังไม่มี)
npm i -g vercel

# 2. Login เข้า Vercel
vercel login

# 3. Deploy (ในโฟลเดอร์โปรเจค)
vercel --prod
```

### วิธีที่ 2: ผ่าน GitHub + Vercel

1. **สร้าง GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/valentine-surprise.git
   git push -u origin main
   ```

2. **เชื่อมต่อ Vercel**
   - ไปที่ [vercel.com](https://vercel.com)
   - Click **"Add New Project"**
   - Import จาก GitHub repo ของคุณ
   - Click **Deploy**

3. **เสร็จ!** 🎉 Vercel จะให้ URL มา

## 📝 วิธีใส่รูปภาพ

### วิธีที่ 1: รูปในเครื่อง
1. เอารูปใส่โฟลเดอร์ `images/`
2. แก้ไข `index.html` หน้า Photo Gallery:

```html
<div class="photo-card" onclick="showSparkle(event)">
    <div class="photo-placeholder">
        <img src="images/photo1.jpg" alt="คำอธิบายรูป">
    </div>
    <p class="photo-caption">แคปชั่นรูป</p>
</div>
```

### วิธีที่ 2: ใช้รูปออนไลน์
```html
<img src="https://example.com/your-image.jpg" alt="คำอธิบาย">
```

## 🎬 วิธีใส่วิดีโอ

### ตัวเลือก 1: ไฟล์วิดีโอในเครื่อง
1. ใส่ไฟล์วิดีโอ (`.mp4`, `.webm`) ในโฟลเดอร์ `videos/`
2. แก้ไข `index.html`:

```html
<video id="loveVideo" controls poster="images/thumbnail.jpg">
    <source src="videos/love-video.mp4" type="video/mp4">
</video>
```

### ตัวเลือก 2: YouTube
1. เอา comment ออกใน `index.html`
2. ใส่ VIDEO_ID ของ YouTube:

```html
<iframe 
    src="https://www.youtube.com/embed/VIDEO_ID_HERE?autoplay=0&rel=0" 
    title="Valentine Video"
    frameborder="0" 
    allowfullscreen>
</iframe>
```

> 💡 หา VIDEO_ID จาก URL YouTube: `youtube.com/watch?v=VIDEO_ID`

## 🎨 วิธีแก้ไขสี

แก้ไขใน `css/style.css`:

```css
/* สีหลัก */
--primary-color: #ff6b9d;
--secondary-color: #ff8fab;

/* ใช้ใน CSS */
background: linear-gradient(45deg, #ff6b9d, #ff8fab);
```

## 🎯 ปรับแต่งข้อความ

แก้ไขใน `index.html`:

- **หน้า Welcome**: บรรทัดที่มี `welcome-text`
- **จดหมายรัก**: ใน `letter-content`
- **แคปชั่นรูป**: ใน `photo-caption`
- **ข้อความสุดท้าย**: ใน `surprise-message`

## 🔧 แก้ไขข้อความตัวอย่าง

### หน้า Welcome
```html
<h1 class="welcome-text">ข้อความของคุณ 💕</h1>
<p class="sub-text">คำบรรยาย...</p>
```

### จดหมายรัก
```html
<div class="letter-content">
    <p>ชื่อเธอ,</p>
    <p>ข้อความที่ต้องการ...</p>
</div>
```

## 📱 Responsive

เว็บไซต์รองรับทุกขนาดหน้าจอ:
- 💻 Desktop: 3 รูปต่อแถว
- 📱 Mobile: 2 รูปต่อแถว

## 🎉 Tips

1. **รูปแนะนำ**: ใช้รูปสี่เหลี่ยมจตุรัส (1:1) จะสวยที่สุด
2. **วิดีโอ**: แนะนำใช้ `.mp4` หรือ YouTube จะโหลดเร็วกว่า
3. **ขนาดไฟล์**: รูปควรไม่เกิน 1MB ต่อรูป
4. **Performance**: Vercel จัดการ cache ให้อัตโนมัติ

## 📄 License

สร้างด้วย 💕 สำหรับคนพิเศษของคุณ

---

สร้างด้วยความรัก | Made with love 💕
