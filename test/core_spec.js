import {setEntries,next,vote} from '../src/core';
import {expect} from 'chai';
import {List,Map} from 'immutable';

describe("application logic", () => {
  describe("setEntries",() => {
    it("loads entries into state", () => {
      const state = Map();
      const entries = List.of("Trainspotting","The Usual Suspects","Silence of the Lambs");
      const nextState = setEntries(state,entries);
      expect(nextState).to.deep.equal(Map({
        entries: List.of("Trainspotting","The Usual Suspects","Silence of the Lambs")
      }));
    });

    it("converts to immutable", () => {
      const state = Map();
      const entries = ["Trainspotting","The Usual Suspects","Silence of the Lambs"];
      const nextState = setEntries(state,entries);
      expect(nextState).to.equal(Map({
        entries: List.of("Trainspotting","The Usual Suspects","Silence of the Lambs")
      }));
    });
  });

  describe("next", () => {
    it("takes the next two entries to vote", () => {
      const state = Map({
        entries: List.of("Trainspotting","The Usual Suspects","Silence of the Lambs")
      });
      const nextState = Map({
        entries: List.of("Silence of the Lambs"),
        vote: Map({
          pair: List.of("Trainspotting","The Usual Suspects")
        })
      });
      expect(nextState).to.equal(next(state));
    });

    it("puts winner of current vote back to entries",() => {
      const state = Map({
        entries: List.of("Silence of the Lambs","Inception","The Prestige"),
        vote: Map({
          pair: List.of("Trainspotting","The Usual Suspects"),
          tally: Map({
            'Trainspotting': 4,
            'The Usual Suspects':5
          })
        })
      });
      const nextState = Map({
        entries: List.of("The Prestige","The Usual Suspects"),
        vote: Map({
          pair: List.of("Silence of the Lambs","Inception")
        })
      });
      expect(nextState).to.equal(next(state));
    });

    it("puts both tied winners back to entries",() => {
      const state = Map({
        entries: List.of("Silence of the Lambs","Inception","The Prestige"),
        vote: Map({
          pair: List.of("Trainspotting","The Usual Suspects"),
          tally: Map({
            'Trainspotting': 5,
            'The Usual Suspects':5
          })
        })
      });
      const nextState = Map({
        entries: List.of("The Prestige","Trainspotting","The Usual Suspects"),
        vote: Map({
          pair: List.of("Silence of the Lambs","Inception")
        })
      });
      expect(nextState).to.equal(next(state));
    });
  });

  describe("vote",() => {
    it("creates a tally for voting", () => {
      const state = Map({
        entries: List.of("Silence of the Lambs"),
        vote: Map({
          pair: List.of("Trainspotting","The Usual Suspects")
        })
      });
      const nextState = Map({
        entries: List.of("Silence of the Lambs"),
        vote: Map({
          pair: List.of("Trainspotting","The Usual Suspects"),
          tally: Map({'Trainspotting': 1})
        })
      });
      expect(nextState).to.equal(vote(state,'Trainspotting'));
    });

    it("Increments the tally if a vote is cast",() => {
      const state = Map({
        entries: List.of("Silence of the Lambs"),
        vote: Map({
          pair: List.of("Trainspotting","The Usual Suspects"),
          tally: Map({'Trainspotting': 1,'The Usual Suspects':3})
        })
      });
      const nextState = Map({
        entries: List.of("Silence of the Lambs"),
        vote: Map({
          pair: List.of("Trainspotting","The Usual Suspects"),
          tally: Map({'Trainspotting': 2,'The Usual Suspects':3})
        })
      });
      expect(nextState).to.equal(vote(state,'Trainspotting'));
    });
  });
});
