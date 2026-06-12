sma invest — design.md
1. product identity
product name: sma invest product type: mobile-first investment education web prototype target user: high school students / siswa sma purpose: help students learn basic investment concepts through short modules, simple quizzes, and progress tracking.
this is a prototype for demo/presentation, not a full production learning platform.
2. design goal
the interface should feel:


clean

modern

beginner-friendly

mobile-first

educational

lightly fintech-inspired

approachable for high school students
the app should not feel too corporate, too childish, or too complex.
main design direction:
a friendly green investment learning app for students who are new to financial literacy.
3. visual style
color direction
use an investment-inspired green palette.
recommended palette:


primary green: #1F7A4D

dark green: #0F3D2E

soft green: #DFF5E7

light mint background: #F3FBF6

neutral white: #FFFFFF

warm neutral: #F7F5EF

text dark: #10251B

muted text: #6B7A70

success green: #2EAD66

warning yellow: #F5C542
usage:


primary green for main CTA, icons, progress bar, and active states

soft green for cards, badges, and section backgrounds

dark green for headings

white/neutral for main background

muted text for descriptions
4. typography
use clean and readable typography.
style:


headings: bold, rounded, friendly

body text: simple and readable

buttons: medium-bold, clear, short labels
recommended font feel:


modern sans-serif

not overly formal

easy to read on mobile
example hierarchy:


page title: 32–40px on mobile

section title: 20–24px

card title: 16–18px

body text: 14–16px

small label: 12px uppercase or semi-bold
5. layout principles
mobile-first layout is the priority.
general rules:


use single-column layout on mobile

use rounded cards

use enough spacing between sections

make buttons large and easy to tap

avoid dense text

use short content blocks

use visual cards for modules, progress, and quiz answers

keep the flow simple and linear
recommended mobile padding:


page horizontal padding: 20px

card padding: 20–24px

section spacing: 32–48px

card radius: 24–32px
6. navigation flow
main user flow:
landing page
↓
login page
↓
dashboard
↓
module list / module detail
↓
quiz
↓
score result
↓
updated progress on dashboard

routes:
/
 /login
 /dashboard
 /modules
 /modules/:id
 /quiz/:moduleId

7. screen requirements
7.1 landing page
purpose
introduce sma invest and encourage users to start learning.
content


app name: sma invest

hero title: “belajar investasi dari sekolah”

subtitle: “pelajari dasar investasi lewat modul singkat, quiz sederhana, dan progress belajar yang mudah dipantau.”

primary CTA: “mulai belajar”

secondary CTA: “lihat demo”

feature cards:


modul edukasi singkat

quiz pemahaman

progress belajar
layout
mobile structure:


top nav / logo

hero section

CTA buttons

feature cards

closing CTA
visual notes


use soft green background gradient

hero section should feel welcoming

feature cards should use icons

CTA button should be highly visible
7.2 login page
purpose
allow users to enter the app using google login.
content


title: “welcome to sma invest”

description: “masuk untuk mulai belajar investasi dari dasar.”

google login button

small note: “prototype edukasi investasi untuk siswa”
layout


centered card layout

soft green background

logo or icon at the top

large google login button
visual notes


keep it minimal

avoid unnecessary fields

only google login is needed for the prototype
7.3 dashboard page
purpose
show the student’s learning progress and available modules.
content


welcome message: “hi, kiya!”

progress overview: “2 dari 5 modul selesai”

progress percentage

module preview cards

logout button
module card content
each card should include:


module title

short description

estimated reading time

completion status

CTA button: “mulai” or “lanjutkan”
example modules:


apa itu investasi?

menabung vs investasi

risiko dan return

jenis-jenis investasi

tips investasi aman untuk pemula
layout
mobile structure:


header with greeting

progress card

quick stats cards

module list section
visual notes


progress card should be the main focus

use green progress bar

completed module can have a small check badge

module cards should look tappable
7.4 module page
purpose
allow students to browse and read learning modules.
content
module list:


module title

description

reading time

status

open button
module detail:


module title

reading time

main educational content

key takeaway card

CTA button: “mulai quiz”
layout
mobile structure:


page header

module cards

selected module detail

start quiz button
visual notes


content must be short and readable

use bullet points or short paragraphs

key takeaway card should stand out softly

avoid long textbook-like blocks
7.5 quiz page
purpose
test student understanding after reading a module.
content


progress indicator: “1/5”

question card

multiple choice answers

submit button

score result

CTA: “kembali ke dashboard”
answer option style


rounded option cards

selected option has green border/background

correct/wrong state can be simple

no need for complex animation
result state
example:


“your score: 80%”

“great job! kamu sudah menyelesaikan modul ini.”

button: “kembali ke dashboard”
visual notes


quiz should feel simple and not stressful

answer options must be large enough for mobile tap

result screen should feel rewarding
8. components
recommended reusable components:
primary button
used for:


mulai belajar

mulai quiz

submit

kembali ke dashboard
style:


green background

white text

rounded full

large tap area
secondary button
used for:


lihat demo

back button

alternative action
style:


border green

white/transparent background

green text
module card
content:


title

description

reading time

status

CTA
style:


rounded card

subtle border

soft background

icon or small badge
progress card
content:


completed modules

progress percentage

progress bar
style:


green hero-style card

high visual priority
quiz option
content:


option text

selected state

correct/wrong state optional
style:


rounded card

border

selected green state
9. interaction notes
important interactions:


clicking “mulai belajar” goes to /login

clicking “lihat demo” goes to /dashboard

after login, user goes to /dashboard

clicking module card opens module detail

clicking “mulai quiz” opens quiz page

submitting quiz shows score

after quiz submission, progress updates

user can return to dashboard
10. responsive behavior
mobile is the main design.
mobile


single column

large buttons

stacked cards

compact content
tablet


cards can become 2 columns

content width max 768px
desktop


keep content centered

avoid stretching too wide

dashboard/module cards can use grid layout
11. content tone
tone should be:


simple

supportive

beginner-friendly

not intimidating

not too technical
avoid:


complex investment jargon

long paragraphs

scary risk-heavy wording

overly formal financial language
example tone:
“investasi itu bukan cuma untuk orang dewasa. kamu bisa mulai memahami konsep dasarnya dari sekarang, pelan-pelan, lewat modul singkat dan quiz sederhana.”
12. out of scope for design
do not design these for current prototype:


admin dashboard

teacher dashboard

leaderboard

certificates

badges

xp system

weekly challenge

forum

notification center

complex analytics

payment

real investment transaction features
13. design priority
priority order:


dashboard clarity

module readability

quiz usability

landing page appeal

visual polish
the most important demo flow:
landing → login → dashboard → module → quiz → score → updated progress

as long as this flow feels clear and complete, the prototype is successful.
14. google stitch prompt
use this prompt to generate the initial ui direction:
create a mobile-first ui design for a web prototype called "sma invest".
sma invest is an investment education platform for high school students. the app helps students learn basic investment concepts through short learning modules, simple quizzes, and progress tracking.
design style:


mobile-first

clean, modern, friendly, and beginner-friendly

investment-inspired green color palette

use soft green, white, dark green, and light neutral backgrounds

professional but still approachable for high school students

rounded cards, clean spacing, readable typography

avoid looking too corporate or too childish

make it feel like a modern fintech learning app
create ui screens for:


landing page content:


app name: sma invest

hero title: "belajar investasi dari sekolah"

subtitle: "pelajari dasar investasi lewat modul singkat, quiz sederhana, dan progress belajar yang mudah dipantau."

primary cta button: "mulai belajar"

secondary cta button: "lihat demo"

feature cards:


modul edukasi singkat

quiz pemahaman

progress belajar


login page content:


welcome to sma invest

short description: "masuk untuk mulai belajar investasi dari dasar."

google login button

simple clean layout


dashboard page content:


welcome message: "hi, kiya!"

progress overview card: "2 dari 5 modul selesai"

progress percentage

module cards with status:


apa itu investasi?

menabung vs investasi

risiko dan return

each module card should have a short description and cta button "mulai"


module detail page content:


module title: "apa itu investasi?"

reading time: "5 min read"

short educational content section

key takeaway card

cta button: "mulai quiz"


quiz page content:


question card

multiple-choice answer options

progress indicator such as "1/5"

submit button

result state showing score: "your score: 80%"

cta button: "kembali ke dashboard"
important:


prioritize mobile layout first.

design should be easy to translate into vue 3 + tailwind css.

use consistent spacing, rounded cards, and clear visual hierarchy.

the ui should look ready for a student project presentation/demo.