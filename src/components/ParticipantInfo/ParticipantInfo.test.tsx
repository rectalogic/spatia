import React from 'react';
import ParticipantInfo from './ParticipantInfo';
import { shallow } from 'enzyme';
import usePublications from '../../hooks/usePublications/usePublications';
import useIsTrackSwitchedOff from '../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';

jest.mock('../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel', () => () => 4);
jest.mock('../../hooks/usePublications/usePublications');
jest.mock('../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff');

const mockUsePublications = usePublications as jest.Mock<any>;
const mockUseIsTrackSwitchedOff = useIsTrackSwitchedOff as jest.Mock<any>;

describe('the ParticipantInfo component', () => {
  it('should display MicOff icon when no audio tracks are published', () => {
    mockUsePublications.mockImplementation(() => []);
    const wrapper = shallow(
      <ParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</ParticipantInfo>
    );
    expect(wrapper.find('MicOffIcon').exists()).toEqual(true);
  });

  it('should not display MicOff icon when an audio track is published', () => {
    mockUsePublications.mockImplementation(() => [{ kind: 'audio', isTrackEnabled: true }]);
    const wrapper = shallow(
      <ParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</ParticipantInfo>
    );
    expect(wrapper.find('MicOffIcon').exists()).toEqual(false);
  });

  it('should not display MicOff icon when an audio track is published and not enabled', () => {
    mockUsePublications.mockImplementation(() => [{ kind: 'audio', isTrackEnabled: false }]);
    const wrapper = shallow(
      <ParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</ParticipantInfo>
    );
    expect(wrapper.find('MicOffIcon').exists()).toEqual(true);
  });

  it('should add hideVideoProp to InfoContainer component when no video tracks are published', () => {
    mockUsePublications.mockImplementation(() => []);
    const wrapper = shallow(
      <ParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</ParticipantInfo>
    );
    expect(wrapper.find('.makeStyles-infoContainer-3').prop('className')).toContain('hideVideo');
  });

  it('should not add hideVideoProp to InfoContainer component when a video track is published', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera' }]);
    const wrapper = shallow(
      <ParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</ParticipantInfo>
    );
    expect(wrapper.find('.makeStyles-infoContainer-3').prop('className')).not.toContain('hideVideo');
  });

  it('should render a VideoCamOff icon when no video tracks are published', () => {
    mockUsePublications.mockImplementation(() => []);
    const wrapper = shallow(
      <ParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</ParticipantInfo>
    );
    expect(wrapper.find('VideocamOffIcon').exists()).toEqual(true);
  });

  it('should not render a VideoCamOff icon when a video track is published', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera' }]);
    const wrapper = shallow(
      <ParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</ParticipantInfo>
    );
    expect(wrapper.find('VideocamOffIcon').exists()).toEqual(false);
  });

  it('should add isSwitchedOff prop to Container component when video is switched off', () => {
    mockUseIsTrackSwitchedOff.mockImplementation(() => true);
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera' }]);
    const wrapper = shallow(
      <ParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</ParticipantInfo>
    );
    expect(wrapper.find('.makeStyles-container-1').prop('className')).toContain('isVideoSwitchedOff');
  });

  it('should not add isSwitchedOff prop to Container component when video is not switched off', () => {
    mockUseIsTrackSwitchedOff.mockImplementation(() => false);
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera' }]);
    const wrapper = shallow(
      <ParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</ParticipantInfo>
    );
    expect(wrapper.find('.makeStyles-container-1').prop('className')).not.toContain('isVideoSwitchedOff');
  });
});
