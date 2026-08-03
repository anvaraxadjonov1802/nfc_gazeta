// Speech synthesis helper supporting Uzbek pronunciation fallback

export class SpeechSynthesisManager {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private onParagraphHighlight?: (paragraphIndex: number) => void;
  private onEndCallback?: () => void;
  private paragraphs: string[] = [];
  private currentParagraphIndex = 0;
  private isPaused = false;
  private rate = 1.0;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public setRate(rate: number) {
    this.rate = rate;
    if (this.currentUtterance) {
      this.currentUtterance.rate = rate;
    }
  }

  public speakParagraphs(
    paragraphs: string[], 
    onParagraphChange?: (index: number) => void,
    onFinish?: () => void,
    startFromIndex = 0
  ) {
    this.stop();
    this.paragraphs = paragraphs;
    this.currentParagraphIndex = startFromIndex;
    this.onParagraphHighlight = onParagraphChange;
    this.onEndCallback = onFinish;
    this.isPaused = false;

    if (!this.paragraphs.length) {
      if (this.onEndCallback) this.onEndCallback();
      return;
    }

    this.playNextParagraph();
  }

  public isSpeaking(): boolean {
    return !!(this.synth && (this.synth.speaking || this.synth.pending) && !this.isPaused);
  }

  private playNextParagraph() {
    if (!this.synth) {
      if (this.onEndCallback) this.onEndCallback();
      return;
    }

    if (this.currentParagraphIndex >= this.paragraphs.length) {
      if (this.onEndCallback) this.onEndCallback();
      return;
    }

    const textToSpeak = this.paragraphs[this.currentParagraphIndex];
    if (this.onParagraphHighlight) {
      this.onParagraphHighlight(this.currentParagraphIndex);
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = this.rate;
    
    // Try to find Uzbek or Turkic or Russian fallback voice
    const voices = this.synth.getVoices();
    const uzVoice = voices.find(v => v.lang.startsWith('uz') || v.lang.startsWith('tr') || v.lang.startsWith('ru'));
    if (uzVoice) {
      utterance.voice = uzVoice;
    }

    utterance.onend = () => {
      if (!this.isPaused) {
        this.currentParagraphIndex++;
        this.playNextParagraph();
      }
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      this.currentParagraphIndex++;
      this.playNextParagraph();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth) {
      this.isPaused = true;
      this.synth.pause();
    }
  }

  public resume() {
    if (this.synth) {
      this.isPaused = false;
      this.synth.resume();
    }
  }

  public stop() {
    if (this.synth) {
      this.isPaused = false;
      this.synth.cancel();
    }
  }

  public skipToNext() {
    if (this.currentParagraphIndex < this.paragraphs.length - 1) {
      this.stop();
      this.currentParagraphIndex++;
      this.playNextParagraph();
    }
  }

  public skipToPrevious() {
    if (this.currentParagraphIndex > 0) {
      this.stop();
      this.currentParagraphIndex--;
      this.playNextParagraph();
    }
  }

  public getCurrentIndex() {
    return this.currentParagraphIndex;
  }
}

export const speechManager = new SpeechSynthesisManager();
