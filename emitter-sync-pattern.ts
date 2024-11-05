/* Check the comments first */

import { EventEmitter } from "./emitter";
import { EventDelayedRepository, /*EventRepositoryError*/ } from "./event-repository";
import { EventStatistics } from "./event-statistics";
import { ResultsTester } from "./results-tester";
import { triggerRandomly } from "./utils";

const MAX_EVENTS = 1000;

enum EventName {
  EventA = "A",
  EventB = "B",
}

const EVENT_NAMES = [EventName.EventA, EventName.EventB];

/*

  An initial configuration for this case

*/

function init() {
  const emitter = new EventEmitter<EventName>();

  triggerRandomly(() => emitter.emit(EventName.EventA), MAX_EVENTS);
  triggerRandomly(() => emitter.emit(EventName.EventB), MAX_EVENTS);

  const repository = new EventRepository();
  const handler = new EventHandler(emitter, repository);

  const resultsTester = new ResultsTester({
    eventNames: EVENT_NAMES,
    emitter,
    handler,
    repository,
  });
  resultsTester.showStats(20);
}

/* Please do not change the code above this line */
/* ----–––––––––––––––––––––––––––––––––––––---- */

/*

  The implementation of EventHandler and EventRepository is up to you.
  Main idea is to subscribe to EventEmitter, save it in local stats
  along with syncing with EventRepository.

*/

class EventHandler extends EventStatistics<EventName> {
  // Feel free to edit this class

  repository: EventRepository;

  constructor(emitter: EventEmitter<EventName>, repository: EventRepository) {
    super();
    this.repository = repository;

    const subscribeToSaveStats = (eventName: EventName) => {
      emitter.subscribe(eventName, () => {
          this.setStats(eventName, this.getStats(eventName) + 1);

          this.repository.saveEventData(eventName, this.getStats(eventName) - this.repository.getStats(eventName))
        }
      );
    }

    subscribeToSaveStats(EventName.EventA);
    subscribeToSaveStats(EventName.EventB);
  }
}

class EventRepository extends EventDelayedRepository<EventName> {
  // Feel free to edit this class

  async saveEventData(eventName: EventName, count: number) {
    try {
      await this.updateEventStatsBy(eventName, count);
    } catch (e) {
      // const _error = e as EventRepositoryError;
      // console.warn(_error);
    }
  }
}

init();
