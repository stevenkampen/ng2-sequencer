import { Injectable } from '@angular/core';
import { SoundService } from '../sound';

@Injectable()
export class SequenceService {
  constructor(private soundService: SoundService) {}

  public playSequence(getState): any {
    this.soundService.setAmplitude(
      getState().sequencer.get('amplitude'));

    const currentPosition =
      getState().sequencer.get('currentPosition');

    return this.soundService.playSequence(
      lastScheduledBeat => {
        // console.time('findNote');

        const sequenceData
          = getState().sequencer.getIn(['soundData', 'compiledSequenceData']);

        // console.log('Looking for time:%s in items',
        //   lastScheduledBeat,
        //   sequenceData.toJS());

        const sounds = [];

        let nextSoundIndex =
          this.findHighestIndexWithoutExceedingTime(
            lastScheduledBeat,
            sequenceData
          ) + 1;

        const firstSound = sequenceData.get(nextSoundIndex);
        const time = firstSound ? firstSound.get('time') : null;

        let nextSound = firstSound;

        while (nextSound && nextSound.get('time') === time) {
          sounds.push(nextSound.toJS());
          nextSoundIndex++;
          nextSound = sequenceData.get(nextSoundIndex);
        }

        // console.debug('sounds', sounds.map(x => x.time));

        return sounds;

      }, getState().sequencer.get('bpm'), currentPosition);
  }

  findHighestIndexWithoutExceedingTime(
    suppliedTime: number,
    sequence: any,
    searchStart: number = 0,
    searchEnd: number = sequence.size - 1): number {

    // console.log('searchStart %s, searchEnd %s', searchStart, searchEnd);

    // searchEnd = searchEnd || sequence.size - 1;

    let i = Math.floor(searchStart + (searchEnd - searchStart) / 2);

    // console.log('i:', i);

    const time = sequence.get(i) ? sequence.get(i).get('time') : null;
    // console.log('time:', time);
    // console.log('suppliedTime:', suppliedTime);

    if (sequence.size === 0 || (time > suppliedTime && i <= 0)) {
      return -1;
    } else if (
      (time <= suppliedTime && (i === sequence.size - 1
        || sequence.get(i + 1).get('time') > suppliedTime))) {
      // we reached the highest without going over (or the last one)
      return i;
    } else if (time > suppliedTime) {
      // this sound is later than our supplied time
      searchEnd = i - 1;
    } else if (time <= suppliedTime) {
      // this sound is earlier or equal to our supplied time
      searchStart = i + 1;
    }
    return this.findHighestIndexWithoutExceedingTime(suppliedTime,
      sequence, searchStart, searchEnd);
  }
}
