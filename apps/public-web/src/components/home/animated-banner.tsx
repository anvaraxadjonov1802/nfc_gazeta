"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

import { Icon } from "@/components/ui/icon";

interface AnimatedBannerProps {
  latestIssueHref: string;
  issueCount: number;
  articleCount: number;
  videoCount: number;
}

export function AnimatedBanner({
  latestIssueHref,
  issueCount,
  articleCount,
  videoCount,
}: AnimatedBannerProps) {
  return (
    <section
      className="cinema-hero"
      aria-label="Jaloliddin Manguberdi tezyurar poyezdi"
    >
      <img
        className="cinema-hero__photo"
        src="/images/jaloliddin-manguberdi-hero.webp"
        alt="Jaloliddin Manguberdi tezyurar poyezdi"
        loading="eager"
      />

      <div className="cinema-hero__wash" aria-hidden="true" />
      <div className="cinema-hero__speed" aria-hidden="true" />
      <div className="cinema-hero__rail-light cinema-hero__rail-light--one" aria-hidden="true" />
      <div className="cinema-hero__rail-light cinema-hero__rail-light--two" aria-hidden="true" />

      <div className="cinema-hero__inner">
        <div className="cinema-hero__content">
          <div className="cinema-hero__pill">
            <span className="cinema-hero__train-icon">➜</span>
            <strong>Jaloliddin Manguberdi</strong>
            <span className="cinema-hero__pill-dot" />
            <span>Yuqori tezlikdagi poyezd</span>
          </div>

          <h1 className="cinema-hero__headline">
            <span>TEMIRYO‘LCHI</span>
            <strong>Elektron gazeta</strong>
          </h1>

          <p className="cinema-hero__lead">
            NFC orqali gazetaning elektron sonini bir zumda oching,
            maqolalarni o‘qing va temiryo‘l hayotidagi eng muhim
            yangiliklarni zamonaviy formatda kuzating.
          </p>

          <div className="cinema-hero__actions">
            <Link className="cinema-hero__primary" href={latestIssueHref}>
              <Icon name="newspaper" size={18} />
              So‘nggi nashrni o‘qish
              <span aria-hidden="true">→</span>
            </Link>

            <Link className="cinema-hero__secondary" href="#videolar">
              <span className="cinema-hero__play">
                <Icon name="play" size={15} />
              </span>
              Videolarni ko‘rish
            </Link>
          </div>

          <div className="cinema-hero__stats">
            <div className="cinema-stat">
              <span className="cinema-stat__icon cinema-stat__icon--blue">
                <Icon name="newspaper" size={20} />
              </span>
              <div>
                <span>Nashrlar</span>
                <strong>{issueCount}</strong>
                <small>Elektron sonlar</small>
              </div>
            </div>

            <div className="cinema-stat">
              <span className="cinema-stat__icon cinema-stat__icon--green">
                <Icon name="book" size={20} />
              </span>
              <div>
                <span>Maqolalar</span>
                <strong>{articleCount}</strong>
                <small>Yangi materiallar</small>
              </div>
            </div>

            <div className="cinema-stat">
              <span className="cinema-stat__icon cinema-stat__icon--purple">
                <Icon name="play" size={19} />
              </span>
              <div>
                <span>Videolar</span>
                <strong>{videoCount}</strong>
                <small>Media kontent</small>
              </div>
            </div>

            <div className="cinema-stat cinema-stat--nfc">
              <span className="cinema-stat__icon cinema-stat__icon--orange">
                <Icon name="nfc" size={20} />
              </span>
              <div>
                <span>NFC</span>
                <strong>24/7</strong>
                <small>Bir tegishda o‘qish</small>
              </div>
            </div>
          </div>
        </div>

        <div className="cinema-hero__floating-label" aria-hidden="true">
          <span className="cinema-hero__live-dot" />
          O‘zbekiston temiryo‘llari
        </div>
      </div>

      <div className="cinema-hero__ribbon">
        <div>
          <span className="cinema-hero__mini-train">▰</span>
          <strong>O‘zbekiston temiryo‘llari — taraqqiyot yo‘lida!</strong>
        </div>
        <span>Rasmiy elektron nashr · NFC integratsiya</span>
      </div>

      <style jsx>{`
        .cinema-hero {
          position: relative;
          min-height: 650px;
          overflow: hidden;
          isolation: isolate;
          border-radius: 30px;
          background: #082847;
          color: #fff;
          box-shadow: 0 28px 80px rgba(10, 38, 66, 0.28);
        }

        .cinema-hero__photo {
          position: absolute;
          inset: -3%;
          z-index: -6;
          width: 106%;
          height: 106%;
          object-fit: cover;
          object-position: 58% center;
          filter: saturate(1.08) contrast(1.03) brightness(1.02);
          transform-origin: 62% 66%;
          animation: trainCamera 5.5s ease-in-out infinite alternate;
        }

        .cinema-hero__wash {
          position: absolute;
          inset: 0;
          z-index: -5;
          background:
            linear-gradient(90deg, rgba(3, 25, 48, 0.93) 0%, rgba(5, 38, 70, 0.79) 31%, rgba(5, 42, 75, 0.42) 48%, rgba(4, 34, 61, 0.06) 71%),
            linear-gradient(180deg, rgba(6, 27, 49, 0.03) 48%, rgba(4, 26, 48, 0.52) 100%);
        }

        .cinema-hero__speed {
          position: absolute;
          left: -8%;
          right: -12%;
          bottom: 40px;
          z-index: -3;
          height: 180px;
          opacity: 0.42;
          background: repeating-linear-gradient(
            170deg,
            transparent 0 66px,
            rgba(126, 210, 255, 0.13) 67px 71px,
            transparent 72px 130px,
            rgba(255, 255, 255, 0.21) 131px 134px
          );
          filter: blur(1px);
          animation: speedFlow 0.85s linear infinite;
        }

        .cinema-hero__rail-light {
          position: absolute;
          right: -12%;
          z-index: -2;
          height: 4px;
          width: 72%;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, #28a7ff, #eaf8ff, #1587e3, transparent);
          box-shadow: 0 0 20px rgba(59, 169, 255, 0.78), 0 0 46px rgba(59, 169, 255, 0.42);
          animation: railPulse 1.45s ease-in-out infinite;
        }

        .cinema-hero__rail-light--one {
          bottom: 112px;
          transform: rotate(-4deg);
        }

        .cinema-hero__rail-light--two {
          bottom: 82px;
          width: 62%;
          opacity: 0.58;
          transform: rotate(-3deg);
          animation-delay: -0.55s;
        }

        .cinema-hero__inner {
          position: relative;
          min-height: 570px;
          padding: 58px 54px 120px;
        }

        .cinema-hero__content {
          position: relative;
          z-index: 4;
          width: min(680px, 54%);
        }

        .cinema-hero__pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          min-height: 42px;
          padding: 0 18px;
          border: 1px solid rgba(116, 205, 255, 0.72);
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(0, 83, 186, 0.88), rgba(46, 133, 224, 0.36));
          box-shadow: inset 0 0 16px rgba(255, 255, 255, 0.06), 0 8px 28px rgba(0, 48, 104, 0.23);
          backdrop-filter: blur(12px);
          font-size: 13px;
          white-space: nowrap;
        }

        .cinema-hero__pill strong {
          font-weight: 900;
        }

        .cinema-hero__pill-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #62d4ff;
          box-shadow: 0 0 12px #62d4ff;
        }

        .cinema-hero__train-icon {
          font-size: 18px;
          transform: skewX(-12deg);
        }

        .cinema-hero__headline {
          margin: 30px 0 0;
          line-height: 0.95;
          letter-spacing: -0.045em;
          text-shadow: 0 8px 30px rgba(1, 19, 38, 0.4);
        }

        .cinema-hero__headline span,
        .cinema-hero__headline strong {
          display: block;
        }

        .cinema-hero__headline span {
          font-family: var(--font-serif, Georgia, serif);
          font-size: clamp(52px, 5.2vw, 82px);
          font-weight: 950;
          color: #fff;
        }

        .cinema-hero__headline strong {
          margin-top: 10px;
          font-size: clamp(42px, 4.6vw, 70px);
          font-weight: 950;
          color: #27a8ff;
          text-shadow: 0 5px 22px rgba(0, 82, 159, 0.42);
        }

        .cinema-hero__lead {
          max-width: 590px;
          margin: 26px 0 0;
          color: rgba(245, 249, 255, 0.92);
          font-size: 17px;
          line-height: 1.68;
          text-shadow: 0 3px 14px rgba(0, 17, 35, 0.48);
        }

        .cinema-hero__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 13px;
          margin-top: 28px;
        }

        .cinema-hero__primary,
        .cinema-hero__secondary {
          display: inline-flex;
          min-height: 52px;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-radius: 15px;
          padding: 0 21px;
          font-size: 14px;
          font-weight: 850;
          transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease;
        }

        .cinema-hero__primary {
          background: linear-gradient(135deg, #1387ff, #0668df);
          color: #fff;
          box-shadow: 0 12px 28px rgba(0, 100, 217, 0.32);
        }

        .cinema-hero__primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 34px rgba(0, 100, 217, 0.43);
        }

        .cinema-hero__secondary {
          border: 1px solid rgba(255, 255, 255, 0.32);
          background: rgba(16, 48, 82, 0.56);
          color: #fff;
          backdrop-filter: blur(10px);
        }

        .cinema-hero__secondary:hover {
          transform: translateY(-2px);
          background: rgba(26, 67, 108, 0.72);
        }

        .cinema-hero__play {
          display: grid;
          width: 29px;
          height: 29px;
          place-items: center;
          border-radius: 50%;
          background: #258bdf;
        }

        .cinema-hero__stats {
          position: absolute;
          left: 54px;
          bottom: 28px;
          z-index: 5;
          display: grid;
          width: min(830px, calc(100vw - 170px));
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .cinema-stat {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: 12px;
          border: 1px solid rgba(255, 255, 255, 0.55);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.94);
          padding: 14px;
          color: #173a5d;
          box-shadow: 0 10px 25px rgba(3, 28, 54, 0.15);
          backdrop-filter: blur(12px);
        }

        .cinema-stat__icon {
          display: grid;
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          place-items: center;
          border-radius: 12px;
          color: #fff;
        }

        .cinema-stat__icon--blue { background: #0d81ff; }
        .cinema-stat__icon--green { background: #17af5d; }
        .cinema-stat__icon--purple { background: #7e35da; }
        .cinema-stat__icon--orange { background: #f0601b; }

        .cinema-stat div {
          min-width: 0;
        }

        .cinema-stat span:not(.cinema-stat__icon) {
          display: block;
          color: #315270;
          font-size: 10px;
          font-weight: 700;
        }

        .cinema-stat strong {
          display: block;
          margin-top: 1px;
          color: #15385d;
          font-size: 23px;
          line-height: 1;
          font-weight: 950;
        }

        .cinema-stat small {
          display: block;
          margin-top: 5px;
          overflow: hidden;
          color: #8290a1;
          font-size: 9px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .cinema-hero__floating-label {
          position: absolute;
          right: 26px;
          top: 24px;
          z-index: 5;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(255, 255, 255, 0.28);
          border-radius: 999px;
          background: rgba(6, 39, 70, 0.5);
          padding: 8px 12px;
          color: #f8fcff;
          font-size: 10px;
          font-weight: 800;
          backdrop-filter: blur(12px);
        }

        .cinema-hero__live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #5bdbff;
          box-shadow: 0 0 0 4px rgba(91, 219, 255, 0.12), 0 0 14px rgba(91, 219, 255, 0.78);
          animation: livePulse 1.5s ease-in-out infinite;
        }

        .cinema-hero__ribbon {
          position: absolute;
          left: 28px;
          right: 28px;
          bottom: 18px;
          z-index: 6;
          display: flex;
          min-height: 54px;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border: 1px solid rgba(57, 175, 255, 0.6);
          border-radius: 17px;
          background: linear-gradient(90deg, rgba(0, 53, 124, 0.96), rgba(2, 72, 159, 0.93), rgba(0, 49, 112, 0.96));
          padding: 0 22px;
          color: #84d5ff;
          box-shadow: 0 12px 30px rgba(0, 28, 67, 0.28);
          backdrop-filter: blur(12px);
        }

        .cinema-hero__ribbon div {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cinema-hero__ribbon strong {
          font-size: 13px;
          font-weight: 900;
        }

        .cinema-hero__ribbon > span {
          color: rgba(166, 218, 249, 0.76);
          font-size: 10px;
        }

        .cinema-hero__mini-train {
          color: #fff;
          font-size: 20px;
        }

        @keyframes trainCamera {
          0% { transform: translate3d(-1.4%, 0, 0) scale(1.065); }
          100% { transform: translate3d(1.9%, -0.15%, 0) scale(1.085); }
        }

        @keyframes speedFlow {
          from { transform: translateX(0); }
          to { transform: translateX(-118px); }
        }

        @keyframes railPulse {
          0%, 100% { opacity: 0.35; transform: translateX(4%) rotate(-4deg) scaleX(0.9); }
          50% { opacity: 1; transform: translateX(-6%) rotate(-4deg) scaleX(1.06); }
        }

        @keyframes livePulse {
          0%, 100% { opacity: 0.55; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.08); }
        }

        @media (max-width: 1050px) {
          .cinema-hero { min-height: 690px; }
          .cinema-hero__inner { min-height: 610px; padding: 46px 34px 132px; }
          .cinema-hero__content { width: 62%; }
          .cinema-hero__stats { left: 34px; width: calc(100% - 68px); }
        }

        @media (max-width: 760px) {
          .cinema-hero {
            min-height: 760px;
            border-radius: 22px;
          }

          .cinema-hero__photo {
            inset: -2%;
            width: 104%;
            height: 104%;
            object-position: 66% center;
          }

          .cinema-hero__wash {
            background:
              linear-gradient(180deg, rgba(4, 26, 48, 0.18) 0%, rgba(4, 28, 50, 0.44) 36%, rgba(3, 25, 48, 0.93) 69%, rgba(3, 23, 44, 0.98) 100%);
          }

          .cinema-hero__inner {
            min-height: 680px;
            display: flex;
            align-items: flex-end;
            padding: 220px 18px 158px;
          }

          .cinema-hero__content { width: 100%; }
          .cinema-hero__pill { max-width: 100%; font-size: 10px; padding: 0 12px; }
          .cinema-hero__headline { margin-top: 19px; }
          .cinema-hero__headline span { font-size: clamp(38px, 12vw, 58px); }
          .cinema-hero__headline strong { font-size: clamp(32px, 10.5vw, 50px); }
          .cinema-hero__lead { margin-top: 17px; font-size: 14px; line-height: 1.55; }
          .cinema-hero__actions { margin-top: 20px; }
          .cinema-hero__primary, .cinema-hero__secondary { flex: 1 1 210px; }

          .cinema-hero__stats {
            left: 18px;
            right: 18px;
            bottom: 86px;
            width: auto;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
          }

          .cinema-stat { padding: 10px; border-radius: 13px; }
          .cinema-stat__icon { width: 34px; height: 34px; flex-basis: 34px; border-radius: 10px; }
          .cinema-stat strong { font-size: 18px; }
          .cinema-stat small { display: none; }
          .cinema-hero__floating-label { right: 14px; top: 14px; }

          .cinema-hero__ribbon {
            left: 14px;
            right: 14px;
            bottom: 14px;
            min-height: 58px;
            padding: 0 14px;
          }

          .cinema-hero__ribbon > span { display: none; }
          .cinema-hero__ribbon strong { font-size: 11px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cinema-hero__photo,
          .cinema-hero__speed,
          .cinema-hero__rail-light,
          .cinema-hero__live-dot {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
